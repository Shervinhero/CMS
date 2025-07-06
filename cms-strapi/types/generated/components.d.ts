import type { Schema, Struct } from '@strapi/strapi';

export interface AddresscomponentAddresscomponent
  extends Struct.ComponentSchema {
  collectionName: 'components_addresscomponent_addresscomponents';
  info: {
    displayName: 'Addresscomponent';
    icon: 'pinMap';
  };
  attributes: {
    city: Schema.Attribute.String;
    country: Schema.Attribute.String;
    number: Schema.Attribute.String;
    street: Schema.Attribute.String;
    zipcode: Schema.Attribute.String;
  };
}

export interface HourOpeninghour extends Struct.ComponentSchema {
  collectionName: 'components_hour_openinghours';
  info: {
    displayName: 'openinghour';
    icon: 'clock';
  };
  attributes: {
    Close: Schema.Attribute.DateTime;
    open: Schema.Attribute.DateTime;
  };
}

export interface IconMediaIconMedia extends Struct.ComponentSchema {
  collectionName: 'components_icon_media_icon_medias';
  info: {
    displayName: 'Icon_Media';
    icon: 'dashboard';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Icon: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
  };
}

export interface MyComponentContactData extends Struct.ComponentSchema {
  collectionName: 'components_my_component_contact_data';
  info: {
    description: '';
    displayName: 'Contact Data';
    icon: 'user';
  };
  attributes: {
    Address: Schema.Attribute.Component<
      'addresscomponent.addresscomponent',
      false
    >;
    EmailAddress: Schema.Attribute.Email;
    FirstName: Schema.Attribute.String;
    LastName: Schema.Attribute.String;
    Phone: Schema.Attribute.String;
  };
}

export interface PriceDetailsPriceDetails extends Struct.ComponentSchema {
  collectionName: 'components_price_details_price_details';
  info: {
    displayName: 'PriceDetails';
    icon: 'database';
  };
  attributes: {
    base_price: Schema.Attribute.Decimal;
    currency: Schema.Attribute.Enumeration<['currency:', 'Euro', 'Dollar']>;
    discount: Schema.Attribute.Decimal;
    final_price: Schema.Attribute.Decimal;
    Reason: Schema.Attribute.String;
  };
}

export interface RefundPolicyBlockRefundPolicyBlock
  extends Struct.ComponentSchema {
  collectionName: 'components_refund_policy_block_refund_policy_blocks';
  info: {
    displayName: 'RefundPolicyBlock';
    icon: 'link';
  };
  attributes: {
    RefundPolicyBlock: Schema.Attribute.RichText;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'addresscomponent.addresscomponent': AddresscomponentAddresscomponent;
      'hour.openinghour': HourOpeninghour;
      'icon-media.icon-media': IconMediaIconMedia;
      'my-component.contact-data': MyComponentContactData;
      'price-details.price-details': PriceDetailsPriceDetails;
      'refund-policy-block.refund-policy-block': RefundPolicyBlockRefundPolicyBlock;
    }
  }
}
