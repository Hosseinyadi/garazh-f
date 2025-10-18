const fetch = require('node-fetch');

class SMSService {
    constructor() {
        // ... (same constructor)
    }

    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async sendOTP(phoneNumber, otpCode) {
        try {
            let cleanPhone = phoneNumber.replace(/^\+98/, '0');
            if (!cleanPhone.startsWith('0')) {
                cleanPhone = '0' + cleanPhone;
            }

            if (this.provider === 'smsir') {
                const mobileForSmsIr = cleanPhone.replace(/^0/, '');
                const payload = {
                    mobile: mobileForSmsIr,
                    templateId: this.smsIrTemplateId,
                    parameters: [{ name: 'Code', value: otpCode }]
                };
                const headers = {
                    'Content-Type': 'application/json',
                    'Accept': 'text/plain',
                    'x-api-key': this.smsIrApiKey
                };

                if (this.sandbox) {
                    console.log(`[SANDBOX OTP] For phone ${mobileForSmsIr}, code is: ${otpCode}`);
                    return { success: true, messageId: `sandbox-${Date.now()}`, message: 'OTP sent (sms.ir sandbox)' };
                }

                const response = await fetch(this.smsIrVerifyUrl, {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: headers
                });

                const responseData = await response.json();

                if (responseData?.status === 1) {
                    return { success: true, messageId: responseData.data?.messageId || null, message: 'OTP sent successfully (sms.ir)' };
                }
                return { success: false, message: responseData?.message || 'Failed to send OTP (sms.ir)' };
            }

            // Fallback for payamak-panel (if needed, would also need to be converted to fetch)
            console.error('Payamak-panel provider is not implemented with node-fetch in this patch.');
            return { success: false, message: 'Payamak-panel not supported in this configuration.' };

        } catch (error) {
            console.error('SMS sending error (node-fetch):', error);
            return { success: false, error: error.message, message: 'Failed to send OTP' };
        }
    }

    // ... (rest of the class is the same)
}

module.exports = new SMSService();
