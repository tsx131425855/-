/**
 * element 一些简单的封装
 * 爱用不用
 */

/**
 *
 * @param {*} that    this
 * @param {*} title      MessageBox 标题
 * @param {*} message   MessageBox 消息正文内容
 * @param {*} confirmButton 	确定按钮的文本内容
 * @param {*} cancelButton  取消按钮的文本内容
 * @param {*} center    	是否居中布局
 * @param {*} showCancel    是否显示取消按钮
 * @param {*} showConfirm   是否显示确定按钮
 * @param {*} showInput     是否显示输入框
 * @param {*} inputPlaceholder  输入框的占位符
/**
 *
 *
 * @export
 * @param {Object} mes
 */
export function MessageBoxs(mes) {
  const obj = {
    that: false,
    title: "",
    message: "",
    confirmButton: "确定",
    cancelButton: "取消",
    center: false,
    showCancel: true,
    showConfirm: true,
    showInput: false,
    inputPlaceholder: ""
  };
  Object.assign(obj, mes);

  return new Promise(resolve => {
    if (obj.that) {
      /** 弹框确定取消 */
      obj.that
        .$confirm(obj.message, obj.title, {
          confirmButtonText: obj.conpmnfirmButton,
          cancelButtonText: obj.cancelButton,
          type: "warning",
          center: obj.center,
          distinguishCancelAndClose: true,
          showCancelButton: obj.showCancel,
          showConfirmButton: obj.showConfirm,
          showInput: obj.showInput,
          inputPlaceholder: obj.inputPlaceholder
        })
        .then(() => {
          resolve(true);
        })
        .catch(action => {
          resolve(action);
        });
    } else console.info("哪里错了心理要有点b数");
  });
}
/**
 *
 * @param {*} x
 * message	消息文字
 * type	主题
 * center	文字是否居中
 * showClose	是否显示关闭按钮
 */
export function Tips(val) {
  const x = {
    that: false,
    type: "info",
    message: "",
    center: false,
    showClose: false
  };
  Object.assign(x, val);
  x.that.$message({
    message: x.message,
    center: x.center,
    type: x.type,
    showClose: x.showClose
  });
}
