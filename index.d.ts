import * as React from "react";

export interface FitAnalyticsWidgetProps {
  /**
   * Product serial; when the prop changes a new product will be loaded
   * the change may trigger `onLoad` callback
   */
  productSerial: string;

  /**
   * Dictionary of all possible size codes; the key is a size code and value is true/false depending on the currently in-stock availability of the size
   * the change may trigger `onLoad` callback
   */
  manufacturedSizes?: Record<string, string>;

  /**
   * Array of available size; all size codes that are currently available in-stock should be listed
   *
   * @deprecated The method should not be used
   */
  sizes?: string[];

  /**
   * ID of the currently logged-in user
   */
  userId?: string;

  /**
   * The ISO-code of the current language (when both shop & user are same)
   */
  language?: string;

  /**
   * The ISO-code of user's selected language, where applicable
   */
  userLanguage?: string;

  /**
   * The ISO-code of shop's current default language
   */
  shopLanguage?: string;

  /**
   * The ISO country code of the current shop
   */
  shopCountry?: string;

  /**
   * The full URL for thumbnail
   */
  thumb?: string;

  /**
   * Preferred units system (0 - metric; 1 - US imperial; 2 - british imperial)
   */
  metric?: 0 | 1 | 2;

  /**
   * The widget has been initialized and can received commands
   */
  onReady?: () => void;

  /**
   * A new product has been loaded
   */
  onLoad?: (productSerial: string, details: object) => void;

  /**
   * An error was triggered when loading a products
   */
  onError?: (productSerial: string, details: object) => void;

  /**
   * A recommendation has been received
   */
  onRecommend?: (productSerial: string, size: string, details: object) => void;

  /**
   * An add-to-cart button was clicked.
   * When this callback is defined, the widget change the wording on the results closing
   * button and will invoke this callback, when the user clicks it
   */
  onCart?: (productSerial: string, size: string, details: object) => void;

  /**
   * A close button has been clicked (or `close` method was called.)
   * The `size` argument will contain the last visible recommended size, when it's present
   */
  onClose?: (productSerial: string, size: string, details: object) => void;
}

export interface PurchaseReportAttributes {
  shop: string;

  /**
   * Product serial (ID)
   */
  productSerial: string;

  /**
   * A size-specific identifer if exists
   */
  shopArticleCode?: string;

  /**
   * 13-digits universal barcode, that identifies the product and size
   */
  ean?: string;

  /**
   * The purchased size code
   */
  purchasedSize: string;

  /**
   * The current logged-in user ID
   */
  userId?: string;

  /**
   * An ID of the order
   */
  orderId: string;

  /**
   * price of the item as number
   */
  price: number;

  /**
   * ISO 4217 currency code
   */
  currency: string;

  /**
   * Country in which the purchase was made
   */
  shopCountry?: string;

  /**
   * Language in which the purchase was made
   */
  language?: string;

  shopLanguage?: string;

  sizeRegion?: string;

  shopSizingSystem?: string;

  /**
   * Set to `true` if the item was returned (when reporting returns)
   */
  returned?: boolean;

  /**
   * Short message for the reason of the return
   */
  reason?: string;
}

export interface PurchaseReportResponse {
  response: [Response, Response][];
  total: number;
}

export class FitAnalyticsWidget extends React.Component<FitAnalyticsWidgetProps> {}

export class PurchaseReport {
  constructor(props: PurchaseReportAttributes);

  export(): PurchaseReport;
}

export class PurchaseReporter {
  constructor(props: PurchaseReportAttributes);

  sendReports(
    items: (PurchaseReport | PurchaseReportAttributes)[]
  ): Promise<PurchaseReportResponse>;
}
