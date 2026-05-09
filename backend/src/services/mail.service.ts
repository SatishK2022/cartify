import path from "node:path";
import ejs from "ejs";
import { transporter } from "../config/mail";
import { env } from "../config/env";

interface SendEmailOptions {
    to: string;
    subject: string;
    template: string;
    data: Record<string, any>;
}

export const sendEmail = async ({ to, subject, template, data }: SendEmailOptions) => {
    // child template path
    const childTemplate = path.join(
        process.cwd(),
        "src",
        "templates",
        "emails",
        `${template}.ejs`
    );

    // base template path
    const baseTemplatePath = path.join(
        process.cwd(),
        "src",
        "templates",
        "emails",
        "layouts",
        "base.ejs"
    );

    // render the child template
    const emailBody = await ejs.renderFile(childTemplate, data);

    const html = await ejs.renderFile(baseTemplatePath, {
        title: subject,
        appName: "Cartify",
        supportEmail: env.MAIL_FROM,
        body: emailBody
    });

    const info = await transporter.sendMail({
        from: env.MAIL_FROM,
        to,
        subject,
        html
    })

    return info;
}
