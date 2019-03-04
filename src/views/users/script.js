export default {
  data() {
    return {
      list: [],
      //   页码
      pagenum: 1,
      //   每页显示多少条
      pagesize: 10,
      //   总条数
      count: 0,
      searchValue: "",
      // 分配角色 角色权限分配 默认是请选择
      currentRoleId: -1,
      // 角色名称
      currentName: "",
      // 用户id ，通过scope.row赋值过来的
      currentUserId: -1,
      //   添加对话框显示与隐藏
      addUserdialogFormVisible: false,
      // 编辑对话框
      editUserdialogFormVisible: false,
      //分配角色对话框
      setRoledialogVisible: false,
      // 角色列表
      roles: [],
      // 表单
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  created: function () {
    this.loadList();
  },
  methods: {
    // 初始化列表
    async loadList() {
      var res = await this.$http.get(
        `/users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchValue
        }`
      );
      let {
        meta: { status, msg }
      } = res.data;
      // 请求成功
      if (status == 200) {
        // 获取分页数据
        let {
          data: {
            data: { pagenum, total }
          }
        } = res;
        // 更新页码
        this.pagenum = pagenum;
        // 更新总条数
        this.count = total;
        let {
          data: {
            data: { users }
          }
        } = res;
        this.list = users;
      } else {
        this.$message.warning(msg);
      }
    },
    // 实现分配角色
    async jurisdiction() {
      let res = await this.$http.put(`users/${this.currentUserId}/role`, {
        rid: this.currentRoleId
      })
      let { data: { meta: { msg, status } } } = res;
      if (status == 200) {
        this.setRoledialogVisible = false
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    //  删除功能实现
    // list的数据并不是所有的，而是每次加载最多显示十条数据，根据分页，开始时候获取的只是十条数据，因为list长度可适用于当前页的长度
    async deleteHandle(id) {
      let res = await this.$http.delete(`/users/${id}`)
      let { data: { meta: { status, msg } } } = res;
      this.$confirm('是否删除此条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        if (status == 200) {
          // 如果只剩这一条数据 并且它的页码不是1的时候，先去减掉一页 再去重新加载
          if (this.list.length = 1 && this.pagenum !== 1) {
            this.pagenum--;
            this.loadList();
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.loadList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 状态改变事件
    async userStatus(user) {
      let res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      let { data: { meta: { msg, status } } } = res;
      if (status == 200) {
        this.$message.success(msg)
      } else {
        this.$mesasage.error(msg);
      }
    },
    // 点击角色分配按钮
    async checktOutHandle(user) {
      this.setRoledialogVisible = true
      this.currentName = user.username;
      this.currentUserId = user.id;
      let res = await this.$http.get(`/roles`);
      let { data: { meta: { msg, status } } } = res;
      this.roles = res.data.data;
      //  角色id
      let userResdata = await this.$http.get(`/users/${user.id}`);
      this.currentRoleId = userResdata.data.data.rid;
    },
    //点击编辑按钮
    editHandleClik(user) {
      // 弹出编辑框
      this.editUserdialogFormVisible = true
      // 熏染当前数据
      this.form.username = user.username;
      this.form.email = user.email;
      this.form.mobile = user.mobile;
      this.form.id = user.id;
    },
    // 编辑功能点击确定
    async editList() {
      // 获取当前用户输入的数据，全局发送给后台，达到更改的目的
      let res = await this.$http.put(`users/${this.form.id}`, {
        email: this.form.email,
        mobile: this.form.mobile
      });
      //  判断是否成功
      let { data: { meta: { msg, status } } } = res;
      if (status === 200) {
        this.editUserdialogFormVisible = false;
        this.$message.success(msg)
        this.from.username = '';
        this.form.email = '';
        this.form.mobile = '';
      } else {
        this.$message.error(msg)
      }
    },
    // 点击取消
    editHandle() {
      this.form.username = '';
      this.form.email = '';
      this.form.mobile = '';
      this.editUserdialogFormVisible = false;
    },
    //  每页显示数据条数变化时触发
    handleSizeChange(val) {
      //  更新每页显示条数
      this.pagesize = val;
      this.loadList();
    },
    // 当页码发生改变时触发
    handleCurrentChange(val) {
      //   将当前页码更新
      this.pagenum = val;
      //页面重新加载
      this.loadList();
    },
    // 查找功能实现
    handleSearch() {
      this.loadList();
    },
    // 添加用户处理函数
    async addList() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          let res = await this.$http.post('/users', this.form);
          const { data: { meta: { status, msg } } } = res;
          if (status == 201) {
            // 清空表单
            // this.form = ''
            // 成功提示
            this.$message.success('添加成功');
            // 关闭对话框
            this.addUserdialogFormVisible = false;
            // 重新加载数据
            this.loadList();
            this.$refs.addForm.resetFields();
          } else {
            // 失败提示
            this.$message.error(msg)
          }
        } else {
          return false;
        }
      });
    },
    // 点击取消时的操作
    errorHandle() {
      // 关闭弹框
      this.addUserdialogFormVisible = false;
      // 清空表单
      this.$refs.addForm.resetFields();
    },
  }
};