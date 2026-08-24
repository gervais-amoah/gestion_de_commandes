// lib/api.ts

import { Order, OrderSortColumn, OrdersResponse, SortDirection } from "./types"

/**
 * Centralized mock data configuration.
 * Adjust these values to scale test data volume and variety.
 */
const MOCK_CONFIG = {
  // Total number of orders to generate
  ORDER_COUNT: 1000,

  // Date range in days (orders will be spread across this many days back from now)
  DATE_RANGE_DAYS: 365,

  // Price ranges for realistic totals
  MIN_ITEM_PRICE: 15,
  MAX_ITEM_PRICE: 215,
  MIN_ORDER_TOTAL: 20,
  MAX_ORDER_TOTAL: 520,

  // Item count per order
  MIN_ITEMS_PER_ORDER: 1,
  MAX_ITEMS_PER_ORDER: 4,

  // Quantity range per item
  MIN_ITEM_QTY: 1,
  MAX_ITEM_QTY: 3,

  // Address/phone formatting
  MAX_STREET_NUMBER: 9999,
  ZIP_MIN: 10000,
  ZIP_MAX: 99999,
  PHONE_AREA_MIN: 100,
  PHONE_AREA_MAX: 999,
  PHONE_EXCH_MIN: 100,
  PHONE_EXCH_MAX: 999,
  PHONE_SUB_MIN: 1000,
  PHONE_SUB_MAX: 9999,

  // ID padding length (e.g., 5 = ORD-00001, supports up to 99999 orders)
  ORDER_ID_PAD_LENGTH: 5,
} as const

// Data pools - kept separate so they can be easily extended without touching config
const POOLS = {
  statuses: ["pending", "processing", "completed", "cancelled"] as const,
  firstNames: [
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
    "William",
    "Olivia",
    "Benjamin",
    "Sophia",
    "Lucas",
    "Mia",
    "Henry",
    "Charlotte",
    "Alexander",
    "Amelia",
    "Daniel",
    "Harper",
    "Matthew",
    "Evelyn",
    "Sebastian",
    "Abigail",
    "Jack",
    "Elizabeth",
    "Owen",
    "Sofia",
    "Aiden",
    "Scarlett",
    "Carter",
    "Victoria",
    "Jayden",
    "Riley",
    "Grayson",
    "Aria",
    "Leo",
    "Chloe",
    "Lincoln",
    "Penelope",
  ],
  lastNames: [
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
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
    "Martin",
    "Lee",
    "Perez",
    "Thompson",
    "White",
    "Harris",
    "Sanchez",
    "Clark",
    "Ramirez",
    "Lewis",
    "Robinson",
    "Walker",
    "Young",
    "Allen",
    "King",
    "Wright",
    "Scott",
    "Torres",
    "Nguyen",
    "Hill",
    "Flores",
    "Green",
    "Adams",
    "Nelson",
    "Baker",
    "Hall",
    "Rivera",
    "Campbell",
    "Mitchell",
  ],
  cities: [
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
    "Jacksonville",
    "Fort Worth",
    "Columbus",
    "Charlotte",
    "Indianapolis",
    "San Francisco",
    "Seattle",
    "Denver",
    "Washington",
    "Nashville",
    "Oklahoma City",
    "El Paso",
    "Boston",
    "Portland",
    "Las Vegas",
    "Memphis",
    "Louisville",
    "Baltimore",
    "Milwaukee",
    "Albuquerque",
    "Tucson",
    "Fresno",
    "Sacramento",
    "Kansas City",
    "Atlanta",
    "Omaha",
  ],
  products: [
    'MacBook Pro 14"',
    "iPhone 15 Pro",
    "AirPods Pro 2",
    "iPad Air M2",
    "Apple Watch Ultra",
    "Samsung Galaxy S24",
    "Sony WH-1000XM5",
    "Dell XPS 15",
    'LG UltraFine 27"',
    "Logitech MX Master 3S",
    "Keychron K8 Pro",
    "Anker 737 Charger",
    "Bose QuietComfort",
    "Nintendo Switch OLED",
    "Kindle Paperwhite",
    "GoPro Hero 12",
    "Dyson V15 Detect",
    "Instant Pot Duo",
    "Nespresso Vertuo",
    "Fitbit Charge 6",
    "Sonos Era 100",
    "Ring Video Doorbell",
    "Ecobee Smart Thermostat",
    "Philips Hue Starter Kit",
  ],
  streets: [
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
    "Elm St",
    "Highland Rd",
    "Lakeview Dr",
    "Sunset Blvd",
    "River Rd",
    "Forest Ln",
    "Hill St",
    "Valley Rd",
    "Church St",
    "Spring St",
    "Franklin Ave",
    "Union St",
    "Liberty Rd",
    "College Ave",
  ],
  states: [
    "CA",
    "NY",
    "TX",
    "FL",
    "IL",
    "WA",
    "MA",
    "PA",
    "OH",
    "GA",
    "NC",
    "MI",
    "NJ",
    "VA",
    "AZ",
    "CO",
    "MN",
    "WI",
    "TN",
    "IN",
  ],
}

// Helper: pick random element from array
const pick = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]

// Helper: random int in range [min, max] inclusive
const randInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min

// Generate realistic mock orders
const generateMockOrders = (count: number): Order[] => {
  return Array.from({ length: count }, (_, i) => {
    const firstName = pick(POOLS.firstNames)
    const lastName = pick(POOLS.lastNames)
    const status = pick(POOLS.statuses)
    const itemCount = randInt(
      MOCK_CONFIG.MIN_ITEMS_PER_ORDER,
      MOCK_CONFIG.MAX_ITEMS_PER_ORDER
    )

    // Generate items with consistent pricing
    const items = Array.from({ length: itemCount }, (_, j) => {
      const prodName = pick(POOLS.products)
      const price =
        Math.round(
          (Math.random() *
            (MOCK_CONFIG.MAX_ITEM_PRICE - MOCK_CONFIG.MIN_ITEM_PRICE) +
            MOCK_CONFIG.MIN_ITEM_PRICE) *
            100
        ) / 100
      const quantity = randInt(
        MOCK_CONFIG.MIN_ITEM_QTY,
        MOCK_CONFIG.MAX_ITEM_QTY
      )

      return {
        id: `item-${i}-${j}`,
        name: prodName,
        sku: `${prodName.substring(0, 3).toUpperCase()}-${String(randInt(1000, 9999))}`,
        quantity,
        price,
      }
    })

    // Calculate total from actual items for internal consistency
    const total =
      Math.round(
        items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100
      ) / 100

    return {
      id: `ORD-${String(i + 1).padStart(MOCK_CONFIG.ORDER_ID_PAD_LENGTH, "0")}`,
      customerName: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `+1 (${randInt(MOCK_CONFIG.PHONE_AREA_MIN, MOCK_CONFIG.PHONE_AREA_MAX)}) ${randInt(MOCK_CONFIG.PHONE_EXCH_MIN, MOCK_CONFIG.PHONE_EXCH_MAX)}-${randInt(MOCK_CONFIG.PHONE_SUB_MIN, MOCK_CONFIG.PHONE_SUB_MAX)}`,
      total,
      status,
      createdAt: new Date(
        Date.now() -
          Math.random() * MOCK_CONFIG.DATE_RANGE_DAYS * 24 * 60 * 60 * 1000
      ).toISOString(),
      items,
      shippingAddress: {
        street: `${randInt(1, MOCK_CONFIG.MAX_STREET_NUMBER)} ${pick(POOLS.streets)}`,
        city: pick(POOLS.cities),
        state: pick(POOLS.states),
        zipCode: String(randInt(MOCK_CONFIG.ZIP_MIN, MOCK_CONFIG.ZIP_MAX)),
        country: "USA",
      },
    }
  })
}

// Store orders in memory - initialize empty, populate on first use
let ALL_ORDERS: Order[] | null = null

const getOrders = (): Order[] => {
  if (!ALL_ORDERS) {
    console.log(
      `[Mock API] Generating ${MOCK_CONFIG.ORDER_COUNT.toLocaleString()} orders...`
    )
    const start = performance.now()
    ALL_ORDERS = generateMockOrders(MOCK_CONFIG.ORDER_COUNT)
    console.log(
      `[Mock API] Generation complete in ${(performance.now() - start).toFixed(2)}ms`
    )
  }
  return ALL_ORDERS
}

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const fetchOrders = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  statuses?: Order["status"][],
  sortBy: OrderSortColumn = "createdAt",
  sortDir: SortDirection = "desc"
): Promise<OrdersResponse> => {
  await delay(500)

  const orders = getOrders()

  let filtered = orders

  // OPTIMIZATION: Use a standard for-loop instead of .filter().
  // It avoids creating a new intermediate array and is slightly faster for 10k+ items.

  if (search && search.trim()) {
    const searchLower = search.toLowerCase().trim()
    const temp: Order[] = []
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i]
      if (
        order.customerName.toLowerCase().includes(searchLower) ||
        order.id.toLowerCase().includes(searchLower) ||
        order.email.toLowerCase().includes(searchLower)
      ) {
        temp.push(order)
      }
    }
    filtered = temp
  }

  // let filtered = [...orders]

  if (statuses && statuses.length > 0) {
    // OPTIMIZATION: If we already filtered by search, iterate over `filtered`.
    // Otherwise iterate over `orders`. Avoids chaining .filter() calls.
    const source = filtered === orders ? orders : filtered
    const temp: Order[] = []

    for (let i = 0; i < source.length; i++) {
      if (statuses.includes(source[i].status)) {
        temp.push(source[i])
      }
    }
    filtered = temp
  }

  const dir = sortDir === "asc" ? 1 : -1
  filtered.sort((a, b) => {
    switch (sortBy) {
      case "total":
        return (a.total - b.total) * dir
      case "status":
        return a.status.localeCompare(b.status) * dir
      case "customerName":
        return a.customerName.localeCompare(b.customerName) * dir
      case "createdAt":
      default:
        return (
          (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) *
          dir
        )
    }
  })

  const total = filtered.length
  const start = (page - 1) * limit
  const end = Math.min(start + limit, total)

  return {
    orders: filtered.slice(start, end),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

export const updateOrderStatus = async (
  orderId: string,
  newStatus: Order["status"]
): Promise<Order> => {
  await delay(700)
  const orders = getOrders()
  const order = orders.find((o) => o.id === orderId)
  if (!order) throw new Error("Order not found")

  order.status = newStatus
  return order
}
