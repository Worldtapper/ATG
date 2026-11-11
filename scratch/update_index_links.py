with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

# Update service cards
c = c.replace(
    '<a href="#" class="service-card fade-up">\n                    <div class="service-image">\n                        <img src="images/WhatsApp Image 2026-10-25 at 11.45.14.jpeg" alt="Metal Fabrication">',
    '<a href="services.html?category=Metal%20Fabrication" class="service-card fade-up">\n                    <div class="service-image">\n                        <img src="images/WhatsApp Image 2026-10-25 at 11.45.14.jpeg" alt="Metal Fabrication">'
)
c = c.replace(
    '<a href="#" class="service-card fade-up" style="transition-delay: 100ms;">\n                    <div class="service-image">\n                        <img src="images/85b949b0-0511-41bf-90ab-435e094475d7.jpg" alt="Interior Solutions">',
    '<a href="services.html?category=Interior%20Solutions" class="service-card fade-up" style="transition-delay: 100ms;">\n                    <div class="service-image">\n                        <img src="images/85b949b0-0511-41bf-90ab-435e094475d7.jpg" alt="Interior Solutions">'
)
c = c.replace(
    '<a href="#" class="service-card fade-up" style="transition-delay: 200ms;">\n                    <div class="service-image">\n                        <img src="images/WhatsApp Image 2026-10-25 at 12.22.38.jpeg" alt="Custom Furniture">',
    '<a href="services.html?category=Custom%20Furniture" class="service-card fade-up" style="transition-delay: 200ms;">\n                    <div class="service-image">\n                        <img src="images/WhatsApp Image 2026-10-25 at 12.22.38.jpeg" alt="Custom Furniture">'
)
c = c.replace(
    '<a href="#" class="service-card fade-up" style="transition-delay: 300ms;">\n                    <div class="service-image">\n                        <img src="images/WhatsApp Image 2026-10-25 at 11.44.48.jpeg" alt="Structural Steel">',
    '<a href="services.html?category=Structural%20Steel" class="service-card fade-up" style="transition-delay: 300ms;">\n                    <div class="service-image">\n                        <img src="images/WhatsApp Image 2026-10-25 at 11.44.48.jpeg" alt="Structural Steel">'
)
c = c.replace(
    '<a href="#" class="service-card fade-up" style="transition-delay: 400ms;">\n                    <div class="service-image">\n                        <img src="images/WhatsApp Image 2026-10-25 at 11.45.38.jpeg" alt="Aluminium & Glass">',
    '<a href="services.html?category=Aluminium%20%26%20Glass" class="service-card fade-up" style="transition-delay: 400ms;">\n                    <div class="service-image">\n                        <img src="images/WhatsApp Image 2026-10-25 at 11.45.38.jpeg" alt="Aluminium & Glass">'
)
c = c.replace(
    '<a href="#" class="service-card fade-up" style="transition-delay: 500ms;">\n                    <div class="service-image">\n                        <img src="images/8116f6c1-f1e2-423a-8917-c782e0737bfa.jpg" alt="Installation">',
    '<a href="services.html?category=Installation" class="service-card fade-up" style="transition-delay: 500ms;">\n                    <div class="service-image">\n                        <img src="images/8116f6c1-f1e2-423a-8917-c782e0737bfa.jpg" alt="Installation">'
)

# Portfolio view all
c = c.replace(
    '<a href="#" class="btn btn-secondary">View All Projects</a>',
    '<a href="gallery.html" class="btn btn-secondary">View All Projects</a>'
)

# Insight cards
c = c.replace(
    '<a href="#" class="insight-card fade-up">\n                        <div class="insight-image-wrapper">',
    '<a href="insights.html" class="insight-card fade-up">\n                        <div class="insight-image-wrapper">'
)
c = c.replace(
    '<a href="#" class="insight-card fade-up" style="transition-delay: 100ms;">\n                        <div class="insight-image-wrapper">',
    '<a href="insights.html" class="insight-card fade-up" style="transition-delay: 100ms;">\n                        <div class="insight-image-wrapper">'
)
c = c.replace(
    '<a href="#" class="insight-card fade-up" style="transition-delay: 200ms;">\n                        <div class="insight-image-wrapper">',
    '<a href="insights.html" class="insight-card fade-up" style="transition-delay: 200ms;">\n                        <div class="insight-image-wrapper">'
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(c)

print("Updated index.html card links successfully.")
