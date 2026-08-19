import config from '../config.json';

/**
 * Everything on /connect comes from here.
 *
 * The phone/email/address also live in public/greysage.vcf, which is what a
 * phone actually saves when someone taps "Save to contacts". Keep the two in
 * sync — the vCard has to be a real served file, because generating one in
 * JavaScript doesn't reliably open the contact sheet on iOS.
 */

export const contactDetails = {
  proprietor: config.proprietary,
  role: config.disciplines.join(' · '),
  phoneDisplay: '+91 99999 99999',
  whatsappNumber: '919999999999', // digits only, country code first, no "+"
  whatsappMessage: 'Hi Greysage, I would like to talk about an order.',
  email: 'hello@greysage.com',
  instagram: 'https://instagram.com/greysage',
  instagramHandle: '@greysage',
  maps: 'https://maps.google.com/?q=Greysage+Clothing',
  mapsLabel: 'View the workshop location',
  vcard: '/greysage.vcf',
};

export const channels = [
  {
    id: 'whatsapp',
    icon: 'whatsapp',
    label: 'WhatsApp',
    value: contactDetails.phoneDisplay,
    href: `https://wa.me/${contactDetails.whatsappNumber}?text=${encodeURIComponent(
      contactDetails.whatsappMessage
    )}`,
    external: true,
  },
  {
    id: 'phone',
    icon: 'phone',
    label: 'Call',
    value: contactDetails.phoneDisplay,
    href: `tel:${contactDetails.phoneDisplay.replace(/\s/g, '')}`,
    copy: contactDetails.phoneDisplay,
  },
  {
    id: 'email',
    icon: 'mail',
    label: 'Email',
    value: contactDetails.email,
    href: `mailto:${contactDetails.email}`,
    copy: contactDetails.email,
  },
  {
    id: 'instagram',
    icon: 'instagram',
    label: 'Instagram',
    value: contactDetails.instagramHandle,
    href: contactDetails.instagram,
    external: true,
  },
  {
    id: 'maps',
    icon: 'map-pin',
    label: 'Location',
    value: contactDetails.mapsLabel,
    href: contactDetails.maps,
    external: true,
  },
];
