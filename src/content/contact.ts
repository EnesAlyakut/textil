/**
 * Contact page copy that isn't in the dictionary (editable in the admin under Pages → Contact).
 * Phone, email, WhatsApp, Instagram and the address come from Settings.
 */
type Mailbox = { label: string; email: string };

/** Department / country inboxes, listed small under the contact cards. */
const mailboxes = (factory: string, germany: string, greece: string): Mailbox[] => [
  { label: factory, email: "info@yegtextile.com" },
  { label: "İstanbul", email: "marketing@yegtextile.com" },
  { label: "Canada", email: "ca.contact@yegtextile.com" },
  { label: germany, email: "de.contact@yegtextile.com" },
  { label: greece, email: "gr.contact@yegtextile.com" },
];

const tr = {
  email: "E-posta",
  mailboxesTitle: "Birimlere göre e-posta",
  mailboxes: mailboxes("Fabrika", "Almanya", "Yunanistan"),
  stepsTitle: "Sonrası nasıl ilerliyor?",
  steps: ["Talebinizi inceliyor, en geç bir iş günü içinde dönüş yapıyoruz.", "İhtiyacı birlikte netleştiriyor; kumaş, adet ve termin konuşuyoruz.", "Numune ve fiyat teklifiyle süreci başlatıyoruz."],
};

export type ContactContent = typeof tr;

const en: ContactContent = {
  email: "Email",
  mailboxesTitle: "Email by office",
  mailboxes: mailboxes("Factory", "Germany", "Greece"),
  stepsTitle: "What happens next?",
  steps: ["We review your request and reply within one business day.", "We clarify the brief together — fabric, quantities and lead time.", "We start the process with a sample and a quote."],
};

const fr: ContactContent = {
  email: "E-mail",
  mailboxesTitle: "E-mail par bureau",
  mailboxes: mailboxes("Usine", "Allemagne", "Grèce"),
  stepsTitle: "Et ensuite ?",
  steps: ["Nous étudions votre demande et répondons sous un jour ouvré.", "Nous précisons ensemble le besoin : tissu, quantités et délais.", "Nous lançons le processus avec un échantillon et un devis."],
};

const es: ContactContent = {
  email: "Correo electrónico",
  mailboxesTitle: "Correo por oficina",
  mailboxes: mailboxes("Fábrica", "Alemania", "Grecia"),
  stepsTitle: "¿Qué pasa después?",
  steps: ["Revisamos tu solicitud y respondemos en un día hábil.", "Concretamos juntos el encargo: tejido, cantidades y plazos.", "Iniciamos el proceso con una muestra y un presupuesto."],
};

const ru: ContactContent = {
  email: "Эл. почта",
  mailboxesTitle: "Почта по офисам",
  mailboxes: mailboxes("Фабрика", "Германия", "Греция"),
  stepsTitle: "Что дальше?",
  steps: ["Мы изучаем ваш запрос и отвечаем в течение одного рабочего дня.", "Вместе уточняем задачу — ткань, количество и сроки.", "Запускаем процесс с образца и коммерческого предложения."],
};

export const contactContent = { tr, en, fr, es, ru };
