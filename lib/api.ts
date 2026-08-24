import { Order, OrdersResponse } from "./types"

// Generate 50 realistic mock orders - only runs on client
const generateMockOrders = (count: number): Order[] => {
  const statuses: Order["status"][] = [
    "pending",
    "processing",
    "completed",
    "cancelled",
  ]
  const firstNames = [
    "John",
    "Jane",
    "Michael",
    "Sarah",
    "Robert",
    "Emily",
    "David",
    "Lisa",
    "James",
    "Emma",
  ]
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
  ]
  const cities = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "Austin",
  ]
  const productNames = [
    "MacBook Pro",
    "iPhone 15",
    "AirPods Pro",
    "iPad Air",
    "Apple Watch",
    "Samsung Galaxy",
    "Sony Headphones",
    "Dell XPS",
    "LG Monitor",
    "Logitech Mouse",
  ]
  const streets = [
    "Main St",
    "Park Ave",
    "Broadway",
    "5th Ave",
    "Market St",
    "Washington Ave",
    "Oak St",
    "Maple Dr",
    "Cedar Ln",
    "Pine St",
  ]

  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const itemCount = Math.floor(Math.random() * 3) + 1

    return {
      id: `ORD-${String(i + 1).padStart(4, "0")}`,
      customerName: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      total: Math.round((Math.random() * 500 + 20) * 100) / 100,
      status,
      createdAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      items: Array.from({ length: itemCount }, (_, j) => ({
        id: `item-${i}-${j}`,
        name: productNames[Math.floor(Math.random() * productNames.length)],
        quantity: Math.floor(Math.random() * 3) + 1,
        price: Math.round((Math.random() * 100 + 10) * 100) / 100,
      })),
      shippingAddress: {
        street: `${Math.floor(Math.random() * 1000)} ${streets[Math.floor(Math.random() * streets.length)]}`,
        city: cities[Math.floor(Math.random() * cities.length)],
        state: ["CA", "NY", "TX", "FL", "IL", "WA", "MA", "PA", "OH", "GA"][
          Math.floor(Math.random() * 10)
        ],
        zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
        country: "USA",
      },
    }
  })
}

// Store orders in memory - initialize empty, populate on first use
let ALL_ORDERS: Order[] | null = null

const getOrders = (): Order[] => {
  if (!ALL_ORDERS) {
    ALL_ORDERS = generateMockOrders(50)
  }
  return ALL_ORDERS
}

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const fetchOrders = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  statuses?: Order["status"][]
): Promise<OrdersResponse> => {
  await delay(500) // Simulate network latency

  const orders = getOrders()
  let filtered = [...orders]

  // Apply search filter
  if (search && search.trim()) {
    const searchLower = search.toLowerCase().trim()
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
  const end = Math.min(start + limit, total)
  const paginatedOrders = filtered.slice(start, end)

  return {
    orders: paginatedOrders,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

export const updateOrderStatus = async (
  orderId: string,
  newStatus: Order["status"]
): Promise<Order> => {
  await delay(300)
  const orders = getOrders()
  const order = orders.find((o) => o.id === orderId)
  if (!order) throw new Error("Order not found")

  order.status = newStatus
  return order
}
