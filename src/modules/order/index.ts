export {
  FULFILLMENT_ALLOWED_TRANSITIONS,
  ORDER_ALLOWED_TRANSITIONS,
  evaluateFulfillmentTransition,
  evaluateOrderTransition,
  type TransitionAllowed,
  type TransitionDecision,
  type TransitionRejected,
  type TransitionRejectionCode,
} from "./domain/order-state-machine";

export {
  cancelOrderSchema,
  fulfillmentTransitionSchema,
  orderListQuerySchema,
  orderTransitionSchema,
  returnDecisionSchema,
  returnRequestSchema,
  shipmentCreateSchema,
  shipmentUpdateSchema,
  type CancelOrderInput,
  type FulfillmentTransitionInput,
  type OrderListQuery,
  type OrderTransitionInput,
  type ReturnDecisionInput,
  type ReturnRequestInput,
  type ShipmentCreateInput,
  type ShipmentUpdateInput,
} from "./domain/order-validation";

export {
  DEFAULT_CANCELLATION_POLICY,
  evaluateCancellation,
  type CancellationDecision,
  type CancellationPolicyConfig,
} from "./domain/cancellation-policy";
