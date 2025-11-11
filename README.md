# HardwarePlanner 🖥️

A comprehensive web application for planning and tracking your PC build components, costs, and compatibility. Built with vanilla HTML, CSS, and JavaScript for maximum compatibility and performance.

## 🚀 Features

### Core Functionality
- **Component Management**: Add, edit, and organize PC components with detailed specifications
- **Price Tracking**: Monitor component prices with history tracking and budget alerts
- **Build Validation**: Automatic compatibility checking for sockets, power requirements, and physical clearances
- **Multiple Builds**: Create and manage multiple PC build configurations
- **Purchase Tracking**: Mark components as purchased and track build progress

### Advanced Features
- **Build Templates**: Pre-configured builds for different use cases (Gaming, Workstation, Office, Budget)
- **Component Comparison**: Side-by-side comparison of similar components with detailed specs
- **Export Options**: Export builds as PDF, PNG, or shareable JSON code
- **Import/Export**: Save and share builds with JSON import/export functionality
- **Currency Support**: Multi-currency support (USD, EUR, GBP, CAD, AUD)
- **Dark/Light Theme**: Toggle between light and dark themes
- **Responsive Design**: Fully responsive design for desktop, tablet, and mobile devices

### Component Categories
- **CPU**: Processors with socket and power compatibility checking
- **GPU**: Graphics cards with power and clearance validation
- **RAM**: Memory modules with DDR type compatibility
- **Motherboard**: Motherboards with socket and RAM type matching
- **Storage**: SSDs and HDDs with capacity tracking
- **PSU**: Power supplies with wattage calculation
- **Case**: PC cases with GPU clearance checking
- **Cooler**: CPU coolers with socket compatibility
- **Other**: Additional components and accessories

## 🛠️ Installation & Usage

### Quick Start
1. **Download**: Clone or download the project files
2. **Open**: Open `index.html` in any modern web browser
3. **Start Building**: Click "Add Component" or "Use Template" to begin

### No Installation Required
This is a client-side web application that runs entirely in your browser. No server setup or installation is needed.

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📱 How to Use

### Getting Started
1. **Create Your First Build**: Click "Add First Component" or select a template
2. **Add Components**: Choose category, enter component name, link, and price
3. **Set Budget**: Optional budget limit with overspend alerts
4. **Track Progress**: Mark components as purchased to track build completion

### Build Management
- **Multiple Builds**: Use the build selector to switch between different configurations
- **Templates**: Quick-start with pre-configured builds for different use cases
- **Validation**: Automatic compatibility checking warns about potential issues
- **Export**: Share your build or create printable documentation

### Advanced Features
- **Component Comparison**: Compare similar components side-by-side
- **Price History**: Track price changes over time for better purchasing decisions
- **Notes**: Add custom notes to components for additional information
- **Drag & Drop**: Reorder components by dragging the grip handle

## 🔧 Technical Details

### Architecture
- **Frontend**: Pure HTML5, CSS3, and ES6+ JavaScript
- **Storage**: Browser localStorage for data persistence
- **Responsive**: CSS Grid and Flexbox for responsive layouts
- **Icons**: Font Awesome for consistent iconography
- **Fonts**: Inter font family for modern typography

### Data Storage
All data is stored locally in your browser using localStorage:
- Build configurations
- Component data
- Price history
- User preferences (theme, currency)

### Performance
- **Lightweight**: No external dependencies or frameworks
- **Fast Loading**: Optimized CSS and JavaScript
- **Efficient**: Minimal DOM manipulation and event handling
- **Responsive**: Smooth animations and transitions

## 🎨 Customization

### Themes
Toggle between light and dark themes using the theme button in the header.

### Currency
Support for multiple currencies with automatic symbol display:
- USD ($) - US Dollar
- EUR (€) - Euro
- GBP (£) - British Pound
- CAD (C$) - Canadian Dollar
- AUD (A$) - Australian Dollar

### Component Categories
Easily extensible component categories with custom icons and colors defined in the JavaScript configuration.

## 📊 Build Templates

### Pre-configured Builds
- **Budget Gaming**: ~$800 - Affordable 1080p gaming build
- **High-End Gaming**: ~$2500 - Premium 4K gaming build
- **Workstation**: ~$3000 - Professional content creation build
- **Office Build**: ~$500 - Basic productivity computer

### Custom Templates
Create your own templates by configuring a build and exporting the JSON code for reuse.

## 🔍 Validation Features

### Compatibility Checking
- **Socket Compatibility**: CPU and motherboard socket matching
- **RAM Compatibility**: DDR type matching between RAM and motherboard
- **Power Requirements**: PSU wattage vs component power consumption
- **Physical Clearance**: GPU length vs case clearance
- **Cooler Compatibility**: CPU cooler socket support

### Visual Indicators
- ✅ **Success**: No compatibility issues found
- ⚠️ **Warning**: Potential issues that may need attention
- ❌ **Error**: Critical compatibility problems

## 💾 Data Management

### Export Options
- **PDF Export**: Professional build documentation
- **PNG Export**: Visual build summary image
- **JSON Export**: Shareable code for backup and sharing

### Import Options
- **JSON Import**: Restore builds from exported JSON code
- **File Import**: Import builds from JSON files

### Data Persistence
- Automatic saving to browser localStorage
- No data loss on page refresh or browser restart
- Export functionality for backup and sharing

## 🌐 Browser Support & Compatibility

### Modern Browser Features Used
- CSS Grid and Flexbox for layouts
- ES6+ JavaScript features (arrow functions, template literals, destructuring)
- localStorage for data persistence
- CSS custom properties (variables)
- Modern CSS selectors and pseudo-elements

### Fallbacks
- Graceful degradation for older browsers
- Progressive enhancement approach
- Accessible markup and keyboard navigation

## 🤝 Contributing

HardwarePlanner welcomes contributions! Here's how you can help:

### Ways to Contribute
- **Bug Reports**: Report issues or unexpected behavior
- **Feature Requests**: Suggest new features or improvements
- **Code Contributions**: Submit pull requests with enhancements
- **Documentation**: Improve documentation and examples
- **Testing**: Test on different devices and browsers

### Development Setup
1. Fork the repository
2. Make your changes
3. Test thoroughly across different browsers
4. Submit a pull request with a clear description

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Font Awesome** for the comprehensive icon library
- **Google Fonts** for the Inter font family
- **Community** for feedback and feature suggestions

## 📞 Support

If you encounter any issues or have questions:
1. Check the browser console for error messages
2. Ensure you're using a supported browser version
3. Try clearing browser cache and localStorage
4. Create an issue with detailed information about the problem

---

**Built with ❤️ for PC enthusiasts and builders worldwide**

*Start planning your dream hardware build today with HardwarePlanner!*