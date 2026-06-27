# Quantify Terminal — Microsoft Store Launch Guide

This guide explains exactly what to publish to Microsoft Partner Center and how the publisher name appears for Store installs.

## 1. What Microsoft Store needs

Microsoft Store does not use the current Inno Setup `.exe` as the ideal submission package. The Store-ready path is:

1. Build the Windows desktop app from the production Windows build.
2. Package it as an `.msix` or `.msixbundle`.
3. Upload that `.msix` / `.msixbundle` to Microsoft Partner Center.
4. Complete the Store listing, age rating, privacy/support URLs, and certification submission.

Current public Windows installer:

- `Quantify-Terminal-Setup-1.0.0.exe`
- Public URL: `https://qtterminalprod001.z29.web.core.windows.net/download/Quantify-Terminal-Setup-1.0.0.exe`

That `.exe` is correct for the website download page, but the Microsoft Store should use MSIX packaging.

## 2. Files to prepare before Partner Center upload

Prepare these files on a Windows build machine:

- `Quantify-Terminal.msix` or `Quantify-Terminal.msixbundle` — Store package to upload.
- App icon assets: Store logo, square logo, wide logo, small tile, splash screen.
- Screenshots: at least one desktop screenshot; ideally 4–6 polished screenshots.
- Privacy policy URL: `https://www.quantifyterminal.com/privacy`
- Terms URL: `https://www.quantifyterminal.com/terms`
- Support/contact URL: `https://www.quantifyterminal.com/connect`
- Release notes for `v1.0.0`.

## 3. Recommended Store listing text

Short description:

> Quantify Terminal is a professional desktop research terminal for market data, portfolios, charts, news, AI-assisted workflows, geopolitical intelligence, and strategy tooling.

Category recommendation:

- Primary: Finance or Business
- Secondary: Productivity, if available

Availability:

- Start with the markets you can support.
- Keep pricing free unless you have payments/licensing ready.

## 4. MSIX packaging steps

On Windows:

1. Install Microsoft MSIX Packaging Tool from Microsoft Store.
2. Build the Windows app normally.
3. Open MSIX Packaging Tool.
4. Choose application package.
5. Capture the install process for the desktop app.
6. Set package identity to match Partner Center.
7. Set publisher identity exactly as Partner Center provides it.
8. Add required capabilities, especially internet/network access.
9. Generate the `.msix` package.
10. Run Windows App Certification Kit locally.
11. Fix any validation errors.
12. Upload the `.msix` to Partner Center.

## 5. Partner Center submission steps

1. Open Microsoft Partner Center.
2. Reserve the app name: `Quantify Terminal`.
3. Create a new app submission.
4. Upload the `.msix` or `.msixbundle`.
5. Fill Store listing:
   - Description
   - Screenshots
   - App icons
   - Privacy policy
   - Support link
   - Release notes
6. Complete age rating questionnaire.
7. Set pricing and availability.
8. Submit for certification.
9. Wait for Microsoft review.
10. After approval, publish to the Store.

## 6. Publisher name in installer / Store install

For the website `.exe` installer, the publisher shown by Windows comes from code signing. If the installer is unsigned, Windows SmartScreen may show `Unknown publisher` or a warning.

For Microsoft Store installs, the publisher shown on the Store listing comes from the Microsoft Partner Center publisher account. The installed MSIX package identity also includes the publisher identity from Partner Center.

So:

- Website `.exe` installer publisher name = your Windows code-signing certificate publisher.
- Microsoft Store listing publisher name = your Partner Center publisher display name.
- Microsoft Store MSIX package publisher identity = Partner Center package identity.

To make the website installer show the correct publisher name, buy/use a Windows code-signing certificate and sign the Inno Setup installer during the Windows build. To make the Store page show the correct publisher name, set the correct publisher display name in Partner Center.

## 7. Store update policy

For Microsoft Store builds, users should receive updates through Microsoft Store. The in-app updater should either be disabled for Store-channel builds or only show informational update messages that direct users to Microsoft Store.
