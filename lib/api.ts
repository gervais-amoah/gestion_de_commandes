import { Order, OrdersResponse } from "./types"

// Generate mock orders
const generateMockOrders = (count: number): Order[] => {
  const statuses: Order["status"][] = [
    "pending",
    "processing",
    "completed",
    "cancelled",
  ]
  const names = [
    "John Doe",
    "Jane Smith",
    "Bob Johnson",
    "Alice Brown",
    "Charlie Wilson",
  ]
  const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"]
  const items = [
    "Laptop",
    "Phone",
    "Headphones",
    "Monitor",
    "Keyboard",
    "Mouse",
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: `ORD-${String(i + 1).padStart(6, "0")}`,
    customerName: names[Math.floor(Math.random() * names.length)] + ` ${i}`,
    email: `customer${i}@example.com`,
    total: Math.round((Math.random() * 500 + 20) * 100) / 100,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    createdAt: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    items: Array.from(
      { length: Math.floor(Math.random() * 3) + 1 },
      (_, j) => ({
        id: `item-${i}-${j}`,
        name: items[Math.floor(Math.random() * items.length)],
        quantity: Math.floor(Math.random() * 5) + 1,
        price: Math.round((Math.random() * 100 + 10) * 100) / 100,
      })
    ),
    shippingAddress: {
      street: `${Math.floor(Math.random() * 1000)} Main St`,
      city: cities[Math.floor(Math.random() * cities.length)],
      state: "CA",
      zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
      country: "USA",
    },
  }))
}

// Store orders in memory
const ALL_ORDERS = generateMockOrders(10000)

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const fetchOrders = async (
  page: number = 1,
  limit: number = 50,
  search?: string,
  statuses?: Order["status"][]
): Promise<OrdersResponse> => {
  await delay(300) // Simulate network latency

  let filtered = ALL_ORDERS

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase()
    filtered = filtered.filter(
      (order) =>
        order.customerName.toLowerCase().includes(searchLower) ||
        order.id.toLowerCase().includes(searchLower) ||
        order.email.toLowerCase().includes(searchLower)
    )
  }

  // Apply status filter
  if (statuses && statuses.length > 0) {
    filtered = filtered.filter((order) => statuses.includes(order.status))
  }

  // Sort by createdAt descending (newest first)
  filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const total = filtered.length
  const start = (page - 1) * limit
  const end = start + limit
  const orders = filtered.slice(start, end)

  return {
    orders,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

export const updateOrderStatus = async (
  orderId: string,
  newStatus: Order["status"]
): Promise<Order> => {
  await delay(200)
  const order = ALL_ORDERS.find((o) => o.id === orderId)
  if (!order) throw new Error("Order not found")

  order.status = newStatus
  return order
}
