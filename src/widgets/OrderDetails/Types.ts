export interface OrderDetailsProps {
  orderDetailsData: orderDataProps[];
}

interface orderDataProps {
  id: number;
  orderNo: string;
  product: string;
  sxu: string;
  payment: number;
  category: string;
  orderstatus: string;
}
