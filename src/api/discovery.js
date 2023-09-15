import axiosInstance from "../utils/axios";

export const getBanner = () => axiosInstance.get('/banner?type=0')

export const getImgList = () => axiosInstance.get('/wall/small')

