const FALLBACK_SITE_URL = "https://aviorliving.com";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || FALLBACK_SITE_URL;

export const BUSINESS_LEGAL_NAME = "Avior Living Pte Ltd";

export const WHATSAPP_CONTACT = "https://wa.me/6588414701";

export const BUSINESS_UEN: string | undefined = "202625239N";

// TODO: set once a written return policy exists and has a page to link to.
export const RETURN_POLICY_URL: string | undefined = undefined;
