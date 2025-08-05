import axiosInstance from "./axiosInstance"

export const WalletTransactionListApi = async(page,transaction_type) =>{
    const response = await axiosInstance.get('/wallet/transactions/',{
        params:{page:page,transaction_type:transaction_type}
    })
    return response.data
} 