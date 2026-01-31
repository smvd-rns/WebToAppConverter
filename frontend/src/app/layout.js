import './globals.css'

export const metadata = {
    title: 'WebToApp Converter',
    description: 'Convert websites to native apps',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
