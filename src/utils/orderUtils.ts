
import { ShopOrder, ApiShopOrder } from '@/types/order';

export function convertShopOrderToApi(order: ShopOrder): ApiShopOrder {
  return {
    id: order.id,
    customer: {
      name: order.customerName,
      phone: order.customerPhone,
    },
    order_type: order.orderType,
    description: order.description,
    status: order.status,
    is_urgent: order.isUrgent,
    created_at: order.createdAt.toISOString(),
    files: order.files?.map(file => ({
      id: file.id,
      original_name: file.name,
      file_size: file.size,
      mime_type: file.type,
      file_path: file.url || ''
    }))
  };
}

export function convertApiOrderToShop(order: ApiShopOrder): ShopOrder {
  return {
    id: order.id,
    customerName: order.customer?.name || 'Unknown',
    customerPhone: order.customer?.phone || '',
    orderType: order.order_type,
    description: order.description,
    status: order.status,
    isUrgent: order.is_urgent,
    createdAt: new Date(order.created_at),
    files: order.files?.map(file => ({
      id: file.id,
      name: file.original_name,
      type: file.mime_type,
      size: file.file_size,
      url: file.file_path
    })),
    services: []
  };
}
