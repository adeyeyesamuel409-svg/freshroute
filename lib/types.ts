export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  unit: string
  imageUrl: string
  farmName: string
  quantity: number
}

export type OrderStatus = 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  user_id: string
  status: OrderStatus
  total_amount: number
  delivery_address: string
  delivery_city: string
  delivery_state: string
  delivery_zip: string
  delivery_phone: string
  delivery_notes: string | null
  created_at: string
  updated_at: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  unit_price: number
  quantity: number
  subtotal: number
}
