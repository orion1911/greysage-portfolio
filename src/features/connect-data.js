import config from '../config.json';

/**
 * Everything on /connect comes from here.
 *
 * The phone/email/address also live in public/greysage.vcf, which is what a
 * phone actually saves when someone taps "Contact". Keep the two in sync — the
 * vCard has to be a real served file, because generating one in JavaScript
 * doesn't reliably open the contact sheet on iOS.
 */

const asset = file => `/assets/images/${encodeURIComponent(file)}`;

export const profile = {
  name: config.name,
  tagline: 'Clothing Manufacturer',
  proprietor: config.proprietary,
};

export const contactDetails = {
  phoneDisplay: '+91 98677 54586',
  whatsappNumber: '919867754586', // digits only, country code first, no "+"
  whatsappMessage: 'Hi GREYSAGE, I would like to talk about an order.',
  email: 'greysageclothing@greysage.com',
  instagram: 'https://instagram.com/greysage_clothing',
  instagramHandle: '@greysage_clothing',
  maps: 'https://maps.google.com/?q=Greysage+Clothing',
  mapsLabel: 'Andheri East, Mumbai',
  vcard: '/greysage.vcf',
  banner: asset('vogue.jpg'),
};

export const whatsappUrl = `https://wa.me/${
  contactDetails.whatsappNumber
}?text=${encodeURIComponent(contactDetails.whatsappMessage)}`;

/** The two glyphs directly under the tagline. */
export const socials = [
  { id: 'home', icon: 'home', label: 'Back to home', href: '/', internal: true },
  { id: 'whatsapp', icon: 'whatsapp', label: 'WhatsApp', href: whatsappUrl },
  { id: 'instagram', icon: 'instagram', label: 'Instagram', href: contactDetails.instagram },
  {
    id: 'contact',
    icon: 'mail',
    label: 'Send us a message',
    href: '/contact',
    internal: true,
  },
];

/**
 * The stacked cards, in display order. `kind` picks the renderer:
 *   'vcard'    — downloads the contact card
 *   'featured' — full-bleed banner card
 *   'link'     — standard row
 */
export const cards = [
  {
    id: 'contact',
    kind: 'vcard',
    icon: 'save-contact',
    label: 'Contact',
    caption: 'Save to your phone',
  },
  {
    id: 'about',
    kind: 'featured',
    label: `About ${config.name}`,
    href: '/',
    internal: true,
  },
  {
    id: 'whatsapp',
    kind: 'link',
    icon: 'whatsapp',
    label: 'WhatsApp',
    caption: contactDetails.phoneDisplay,
    href: whatsappUrl,
    copy: contactDetails.phoneDisplay,
  },
  {
    id: 'instagram',
    kind: 'link',
    icon: 'instagram',
    label: 'Instagram',
    caption: contactDetails.instagramHandle,
    href: contactDetails.instagram,
  },
  {
    id: 'email',
    kind: 'link',
    icon: 'mail',
    label: 'Email',
    caption: contactDetails.email,
    href: `mailto:${contactDetails.email}`,
    copy: contactDetails.email,
  },
  {
    id: 'message',
    kind: 'link',
    icon: 'send',
    label: 'Send us a message',
    caption: 'Write to us right here',
    href: '/contact',
    internal: true,
  },
  {
    id: 'maps',
    kind: 'link',
    icon: 'map-pin',
    label: 'Find us on Maps',
    caption: contactDetails.mapsLabel,
    href: contactDetails.maps,
  },
];
