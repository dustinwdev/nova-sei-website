# Nova Sei Press Website

A fast, static single-page website built with 11ty (Eleventy) featuring no JavaScript, only vanilla HTML and CSS.

## Quick Start

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm start
```

This will start the 11ty development server with hot reload at `http://localhost:8080`

### Build for Production
```bash
npm run build
```

This generates the static site in the `_site` directory.

## Project Structure

```
nova-sei-website/
├── src/
│   ├── _layouts/          # Layout templates
│   │   └── base.njk       # Base HTML template
│   ├── css/               # Stylesheets
│   │   └── styles.css     # Main stylesheet with design system
│   ├── images/            # Image assets
│   └── index.njk          # Homepage
├── _site/                 # Generated output (git-ignored)
├── .eleventy.js           # 11ty configuration
├── package.json           # Dependencies
├── CLAUDE.md              # Design system documentation
└── design-reference.html  # Visual design reference
```

## Features

- **Zero JavaScript**: Pure HTML and CSS for maximum performance
- **Semantic HTML**: Accessible and SEO-friendly markup
- **CSS Variables**: Centralized design system for easy theming
- **Smooth Scrolling**: Native CSS smooth scroll behavior
- **Responsive Design**: Mobile-first approach with breakpoints at 768px and 480px
- **Fast Loading**: Optimized for Google PageSpeed rankings

## Sections

1. **Navigation** - Sticky header with smooth scroll links
2. **Hero** - Eye-catching introduction with CTA
3. **About** - Company background and mission
4. **Services** - Three service cards (Proofreading, Editing, Consultation)
5. **Contact** - Contact form for inquiries
6. **Footer** - Copyright information

## Browser Support

Modern browsers with CSS Grid and CSS Custom Properties support:
- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

## License

MIT
