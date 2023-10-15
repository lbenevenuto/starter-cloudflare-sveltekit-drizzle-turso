import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY, AWS_SES_RETURNPATH, AWS_SES_SOURCE } from '$env/static/private';
import type { User as LuciaUser } from 'lucia';
import { generateEmailVerificationToken, generatePasswordResetToken } from '$lib/server/tokens';

export const sendEmailVerificationLink = async (user: LuciaUser, url: URL) => {
	console.log('sendEmailVerificationLink');

	const token = await generateEmailVerificationToken(user.userId);
	const emailVerificationUrl = `${url.origin}/email-verification/${token}`;

	await sendEmail({
		subject: 'Email validation',
		Body: {
			Text: { Data: 'Validate' },
			Html: { Data: `<a href='${emailVerificationUrl}'>Validate</a>'` }
		},
		destinations: [user.email]
	});
};

export const sendPasswordResetLink = async (user: LuciaUser, url: URL) => {
	console.log('sendPasswordResetLink');

	const token = await generatePasswordResetToken(user);
	const passwordResetLinkUrl = `${url.origin}/password-reset/${token}`;

	await sendEmail({
		subject: 'Reset password',
		Body: {
			Text: { Data: 'Reset password' },
			Html: { Data: `<a href='${passwordResetLinkUrl}'>Reset password</a>'` }
		},
		destinations: [user.email]
	});
};

export const isValidEmail = (maybeEmail: unknown): maybeEmail is string => {
	if (typeof maybeEmail !== 'string') return false;
	if (maybeEmail.length > 255) return false;
	const emailRegexp = /^.+@.+$/; // [one or more character]@[one or more character]
	return emailRegexp.test(maybeEmail);
};

type SendEmailOptionsType = {
	subject: string;
	Body: {
		Text?: {
			Data: string; // required
			Charset?: string;
		};
		Html?: {
			Data: string; // required
			Charset?: string;
		};
	};
	destinations: string[];
};

export const sendEmail = async (SendEmailOptions: SendEmailOptionsType) => {
	console.log('sendEmail');

	// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ses/command/SendEmailCommand/
	const mail = new SendEmailCommand({
		Source: AWS_SES_SOURCE,
		ReturnPath: AWS_SES_RETURNPATH,
		Destination: { ToAddresses: SendEmailOptions.destinations },
		Message: {
			Subject: { Data: SendEmailOptions.subject },
			Body: SendEmailOptions.Body
		}
	});

	await client
		.send(mail)
		.then((data) => {
			// process data.
			console.log('data :', data);
			return data;
		})
		.catch((error) => {
			// error handling.
			console.log('error :', error);
			return null;
		})
		.finally(() => {
			// finally.
			console.log('finally');
		});
};

export const client = new SESClient({
	region: AWS_REGION,
	credentials: {
		accessKeyId: AWS_ACCESS_KEY_ID,
		secretAccessKey: AWS_SECRET_ACCESS_KEY
	}
});
