export interface MobilePaymentDetails {
    transactionType: string;
    phoneNumber: string;
}

export interface PaymentRequest {
    orderId: string;
    amount: number;
    provider: string;
    mobile?: MobilePaymentDetails;
}

export interface PaymentResponse {
    id: number;
    accountId: number;
    amount: number;
    authorization_url?: string;
    callbackUrl?: string;
    description: string;
    paidAmount: string;
    paidBy?: string;
    paymentRef: string;
    provider: string;
    receiptNumber?: string;
    requestCode: string;
    responseCode?: string;
    responseDesc?: string;
    status: string;
}