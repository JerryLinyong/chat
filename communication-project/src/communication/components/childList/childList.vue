<template>
  <div class="list">
    <form action="" method="">
      <div class="input-li">
          <span>账号</span>
          <input type="text" placeholder="请输入eco账号" name="username" id="username">
      </div>
      <div class="input-li">
          <span>密码</span>
          <input type="text"  name="password" id="password">
      </div>
      <table class="tab-box">
        <tr class="tab-thbox">
          <th class="tab-th">
            <input type="checkbox" @click="allcheck">
          </th>
          <th class="tab-th">设备编号</th>
          <th class="tab-th">设备名称</th>
          <th class="tab-th">微信昵称</th>
          <th class="tab-th">微信号</th>
        </tr>
        <tr class="tab-bod" v-for="device in devices" :key="device.id">
          <td class="tab-td">
            <input type="checkbox" name="devid">
          </td>
          <td class="tab-td">  {{device.id}}</td>
          <td class="tab-td">  {{device.deviceName}}</td>
          <td class="tab-td">  {{device.wxName}}</td>
          <td class="tab-td">  {{device.wxId}}</td>
        </tr>
      </table>
      <div class="top-button">
        <button type="submit" class="add">添加</button>
      </div>
    </form>
  </div>
</template> 

<script>
export default {
  props: ["devices"],
  data() {
    return {};
  },
  methods: {
    //全选，反选
    allcheck: function() {
      var cks = document.getElementsByName("devid");
      for (var i = 0; i < cks.length; i++) {
        cks[i].checked == true
          ? (cks[i].checked = false)
          : (cks[i].checked = true);
      }
    }
  }
};
</script>

<style  scoped lang="stylus">
.list {
  height: 100%;
  background: #fff;
  margin-top: 2px;
  padding: 30px;

  .input-li {
    width: 400px;
    height: 48px;
    margin: 30px auto 20px auto;
    position: relative;

    span {
      font-size: 14px;
      line-height: 27px;
      color: #333;
      padding: 0 20px;
      position: absolute;
      top: 0;
      left: 1px;
    }

    input {
      background: none;
      outline: none;
      border: 0px;
      outline: none;
      -webkit-appearance: none;
      border-radius: 0;
      -webkit-appearance: none;
      -moz-appearance: none;
      -o-appearance: none;
      appearance: none;
      width: 398px;
      padding: 5px 5px 5px 66px;
      border-bottom: 1px solid #ddd;
      position: absolute;
      top: 0;
      left: 1px;
      z-index: 1;
      font-size: 14px;
    }
  }

  .top-button {
    width: 80%;
    margin: 20px auto;
  }

  .add {
    height: 30px;
    width: 60px;
    border: none;
    border-radius: 40px;
    background: #4d95fa;
    color: #fff;
    font-weight: bold;
  }

  .tab-box {
    margin: 20px auto;
    width: 80%;
    border-collapse: collapse;
    border-spacing: 0;

    input {
      width: 20px;
      height: 20px;
    }

    .tab-thbox {
      background: #f7f7f7;

      .tab-th {
        border: 1px solid #ddd;
        padding: 9px 15px;
        min-height: 20px;
        line-height: 20px;
        font-size: 14px;
        text-align: center;
      }
    }

    .tab-td {
      border: 1px solid #ddd;
      padding: 9px 15px;
      min-height: 20px;
      line-height: 20px;
      font-size: 14px;
      text-align: center;
    }
  }
}
</style>