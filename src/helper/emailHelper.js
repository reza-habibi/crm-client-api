const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "mitchell.runolfsson21@ethereal.email",
    pass: "nsexBPPyHSGXS1ZYRV",
  },
});
const send = (mailInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      let info = await transporter.sendMail(mailInfo);

      console.log("Message sent: %s", info.messageId);

      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      resolve(info);
    } catch (error) {
      console.log(error);
    }
  });
};

const emailProcessor = ({ email, pin, type , verificationLink }) => {
  let mailInfo = {};

  switch (type) {
    case "request_new_password":
      mailInfo = {
        from: '"Rez CRM Company 👻" <mitchell.runolfsson21@ethereal.email>', // sender address
        to: email, // list of receivers
        subject: "رمز بازیابی کلمه عبور", // Subject line
        text:
          "رمز بازیابی کلمه عبور شما" +
          pin +
          "می باشد . این رمز بعد از یک روز منقضی می گردد.", // plain text body
        html: `<p>با سلام و احترام <br/>
        رمز بازیابی کلمه عبور شما <b>${pin}</b> می باشد . این رمز پس از یک روز منقضی می گردد</p>`, // html body
      };

      send(mailInfo);
      break;

    case "update_password":
      mailInfo = {
        from: '"Rez CRM Company 👻" <mitchell.runolfsson21@ethereal.email>', // sender address
        to: email, // list of receivers
        subject: "کلمه عبور به روز رسانی شد", // Subject line
        text: "کلمه عبور شما به روز رسانی شد", // plain text body
        html: `<p>با سلام و احترام <br/>
کلمه عبور شما به روز رسانی شد</p>`, // html body
      };

      send(mailInfo);
      break;

    case "new_user_confirmation_required":
      mailInfo = {
        from: '"Rez CRM Company 👻" <mitchell.runolfsson21@ethereal.email>', // sender address
        to: email, // list of receivers
        subject: "لطفاً اکانت خود را تائید نمایید", // Subject line
        text: "لطفاً بر روی لینک کلیک نمایید تا اکانت شما فعال گردد .", // plain text body
        html: `<p>با سلام و احترام <br/>
        لطفاً بر روی لینک کلیک نمایید تا اکانت شما فعال گردد .</p>
        <p>${verificationLink}</p>
        `, // html body
      };

      send(mailInfo);
      break;

    default:
      break;
  }
};

module.exports = { emailProcessor };
