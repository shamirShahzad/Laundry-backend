export const Roles = {
  ADMIN: "admin",
  USER: "user",
};

export const ORDER_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const PAYMENT_STATUS = {
  PAID: "paid",
  PARTIAL: "partial",
  UNPAID: "unpaid",
  REFUNDED: "refunded",
};

export const STATUS_CODES = {
  SUCCESS: 200,
  SUCCESS_CREATED: 201,
  SUCCESS_PROCESSING: 202,
  SUCCESS_RESPONSE: 203,
  SUCCESS_NO_CONTENT: 204,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const ERRORS = {
  MSG_ERROR_NOT_FOUND: "Not Found",
  MSG_ERROR_BAD_REQUEST: "Bad Request",
};
