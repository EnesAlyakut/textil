import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { renderMarkdown } from "@/lib/markdown";
import { Glow } from "@/components/site/Glow";
import { getSettings } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

const copy = {
  en: (email: string) => `This policy explains how YEG Textile handles personal data submitted through this website.

## What we collect

When you use the contact form we collect your name, email address and — if you choose to provide them — your phone number, company and message. We do not sell products online and we do not collect payment information.

## How we use it

We use this information only to answer your enquiry and, where relevant, to prepare quotations or samples. We do not share it with third parties for marketing.

## Storage

Messages are stored securely on our servers for as long as needed to handle the enquiry and any resulting business relationship.

## Cookies

This site uses only technically necessary storage (for example to remember that the intro animation has already played). No advertising or tracking cookies are set.

## Your rights

You can ask us to access, correct or delete your data at any time by writing to ${email}.`,
  es: (email: string) => `Esta política explica cómo YEG Textile trata los datos personales enviados a través de este sitio web.

## Qué datos recogemos

Cuando utilizas el formulario de contacto, recogemos tu nombre, tu dirección de correo electrónico y, si decides compartirlos, tu número de teléfono, tu empresa y tu mensaje. No vendemos en línea ni recogemos datos de pago.

## Cómo los utilizamos

Utilizamos esta información únicamente para responder a tu solicitud y, cuando sea necesario, preparar presupuestos o muestras. No la compartimos con terceros con fines de marketing.

## Conservación

Los mensajes se conservan de forma segura en nuestros servidores durante el tiempo necesario para gestionar la solicitud y cualquier relación comercial derivada de ella.

## Cookies

Este sitio solo utiliza el almacenamiento técnicamente necesario (por ejemplo, para recordar que la animación de entrada ya se ha reproducido). No se utilizan cookies publicitarias ni de seguimiento.

## Tus derechos

Puedes solicitar en cualquier momento el acceso, la rectificación o la supresión de tus datos escribiendo a ${email}.`,
  ru: (email: string) => `Эта политика объясняет, как YEG Textile обрабатывает персональные данные, переданные через этот сайт.

## Какие данные мы собираем

Когда вы пользуетесь контактной формой, мы получаем ваше имя, адрес электронной почты и — если вы решите их указать — номер телефона, название компании и ваше сообщение. Мы не продаём онлайн и не собираем платёжные данные.

## Как мы их используем

Мы используем эту информацию только для ответа на ваш запрос и, при необходимости, для подготовки коммерческих предложений или образцов. Мы не передаём её третьим лицам в маркетинговых целях.

## Хранение

Сообщения надёжно хранятся на наших серверах в течение срока, необходимого для обработки запроса и возможного делового сотрудничества.

## Файлы cookie

Сайт использует только технически необходимое хранилище (например, чтобы запомнить, что вступительная анимация уже была показана). Рекламные и отслеживающие cookie не используются.

## Ваши права

Вы можете в любой момент запросить доступ к своим данным, их исправление или удаление, написав на ${email}.`,
  fr: (email: string) => `Cette politique explique comment YEG Textile traite les données personnelles transmises via ce site.

## Ce que nous collectons

Lorsque vous utilisez le formulaire de contact, nous recueillons votre nom, votre adresse e-mail et — si vous choisissez de les communiquer — votre numéro de téléphone, votre société et votre message. Nous ne vendons pas en ligne et ne collectons aucune information de paiement.

## Comment nous les utilisons

Nous utilisons ces informations uniquement pour répondre à votre demande et, le cas échéant, préparer des devis ou des échantillons. Nous ne les partageons pas avec des tiers à des fins de marketing.

## Conservation

Les messages sont conservés de manière sécurisée sur nos serveurs aussi longtemps que nécessaire au traitement de la demande et de toute relation commerciale qui en découle.

## Cookies

Ce site n’utilise que le stockage strictement nécessaire à son fonctionnement (par exemple pour mémoriser que l’animation d’ouverture a déjà été jouée). Aucun cookie publicitaire ou de suivi n’est déposé.

## Vos droits

Conformément au RGPD, vous pouvez à tout moment demander l’accès, la rectification ou la suppression de vos données en écrivant à ${email}.`,
};

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return buildMetadata({ lang, path: "/privacy", title: dict.privacy.title, description: dict.privacy.title });
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const { contact } = await getSettings();
  return (
    <section className="container-x relative isolate grid gap-10 pb-32 pt-[calc(var(--nav-h)+6rem)] md:grid-cols-12">
      <Glow className="-top-[var(--nav-h)]" />
      <div className="md:col-span-4">
        <span aria-hidden className="mb-6 block h-px w-12 bg-brand" />
        <h1 className="display text-fluid-lg">{dict.privacy.title}</h1>
      </div>
      <div className="prose-yeg md:col-span-7 md:col-start-6">{renderMarkdown(copy[lang](contact.email))}</div>
    </section>
  );
}
