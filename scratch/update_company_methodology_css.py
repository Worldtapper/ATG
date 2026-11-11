with open('CSS/company.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Add desktop default for .co-stage-mobile-visual
desktop_rule = """
/* Desktop default for mobile-only stage visuals */
.co-stage-mobile-visual {
    display: none;
}
"""

if '.co-stage-mobile-visual' not in css:
    css = css.replace('.co-stage-pane {', desktop_rule + '\n.co-stage-pane {', 1)

# Now update the mobile styles inside @media (max-width: 768px)
old_mobile_block = """    /* Mobile handling for New Gen Approach Scroller */
    .co-approach-scroll-container {
        height: auto;
        margin-bottom: 40px;
    }

    .co-approach-sticky-stage {
        position: relative;
        height: auto;
        top: auto;
        padding: 40px 16px;
    }

    .co-approach-body-grid {
        grid-template-columns: 1fr;
        gap: 28px;
    }

    .co-stages-card-stack {
        min-height: 380px;
    }

    .co-stage-ghost-num {
        font-size: 5rem;
        top: -10px;
        right: 0;
    }

    .co-approach-stepper-nav {
        grid-template-columns: 1fr 1fr;
        gap: 10px;
    }"""

new_mobile_block = """    /* Mobile Architectural Presentation for Our Methodology */
    .co-approach-scroll-container {
        height: auto !important;
        margin: 0 0 40px 0;
        padding: 40px 0;
    }

    .co-approach-sticky-stage {
        position: relative !important;
        height: auto !important;
        min-height: auto !important;
        top: auto !important;
        padding: 20px 16px;
        background: transparent;
        border: none;
        overflow: visible;
    }

    .co-approach-stage-inner {
        height: auto;
        max-height: none;
        gap: 28px;
    }

    .co-approach-top-bar {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        padding-bottom: 16px;
    }

    .co-approach-header-meta h2 {
        font-size: 1.85rem;
        line-height: 1.2;
    }

    .co-scrub-indicator {
        display: none;
    }

    .co-approach-body-grid {
        display: block;
        width: 100%;
        margin: 0;
    }

    /* Hide the separate desktop-only image window on mobile */
    .co-approach-visual-window {
        display: none !important;
    }

    /* Vertical Golden Spine & Stage Cards */
    .co-stages-card-stack {
        position: relative;
        height: auto;
        min-height: auto;
        max-height: none;
        display: flex;
        flex-direction: column;
        gap: 36px;
        padding-left: 28px;
        border-left: 2px solid rgba(244, 209, 148, 0.3);
        margin-left: 10px;
    }

    .co-stage-pane {
        position: relative !important;
        inset: auto !important;
        display: flex !important;
        flex-direction: column !important;
        opacity: 1 !important;
        visibility: visible !important;
        transform: none !important;
        filter: none !important;
        pointer-events: auto !important;
        background: rgba(14, 14, 18, 0.92);
        border: 1px solid rgba(244, 209, 148, 0.24);
        border-radius: 16px;
        padding: 24px 20px;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }

    .co-stage-pane:hover {
        border-color: rgba(244, 209, 148, 0.5);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 24px rgba(244, 209, 148, 0.12);
    }

    /* Golden Milestone Node on the Spine */
    .co-stage-pane::before {
        content: "";
        position: absolute;
        left: -38px;
        top: 26px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #010102;
        border: 3px solid #F4D194;
        box-shadow: 0 0 14px rgba(244, 209, 148, 0.7);
        z-index: 2;
    }

    .co-stage-ghost-num {
        position: absolute;
        right: 16px;
        top: 10px;
        font-family: var(--font-heading);
        font-size: 3.5rem !important;
        font-weight: 800;
        color: transparent;
        -webkit-text-stroke: 1.5px rgba(244, 209, 148, 0.2) !important;
        opacity: 0.7 !important;
        transform: none !important;
        line-height: 1;
        pointer-events: none;
        user-select: none;
    }

    .co-stage-badge {
        font-size: 0.75rem;
        padding: 4px 12px;
        margin-bottom: 8px;
        align-self: flex-start;
    }

    .co-stage-title {
        font-size: 1.4rem;
        color: var(--clr-cream);
        margin: 0 0 4px 0;
        line-height: 1.25;
    }

    .co-stage-subtitle {
        font-size: 0.86rem;
        color: var(--clr-gold);
        margin-bottom: 12px;
        line-height: 1.4;
    }

    .co-stage-description {
        font-size: 0.92rem;
        color: rgba(252, 231, 204, 0.85);
        line-height: 1.6;
        margin-bottom: 18px;
        max-width: 100%;
    }

    .co-stage-deliverables {
        max-width: 100%;
        margin-bottom: 8px;
    }

    .co-deliverable-chips {
        flex-wrap: wrap;
        gap: 8px;
    }

    .co-chip {
        font-size: 0.78rem;
        padding: 5px 12px;
    }

    /* Embedded Photography Viewfinder for Each Stage on Mobile */
    .co-stage-mobile-visual {
        display: block !important;
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 10;
        border-radius: 12px;
        overflow: hidden;
        margin-top: 20px;
        border: 1px solid rgba(244, 209, 148, 0.28);
        background: #000;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    .co-stage-mobile-visual img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.5s ease;
    }

    .co-stage-pane:hover .co-stage-mobile-visual img {
        transform: scale(1.03);
    }

    .co-mobile-img-badge {
        position: absolute;
        bottom: 12px;
        left: 14px;
        background: rgba(1, 1, 2, 0.88);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid rgba(244, 209, 148, 0.35);
        padding: 5px 12px;
        border-radius: 999px;
        font-size: 0.72rem;
        font-weight: 600;
        color: var(--clr-gold);
        letter-spacing: 0.06em;
        text-transform: uppercase;
    }

    /* Stepper navigation is redundant on vertical mobile timeline */
    .co-approach-stepper-nav {
        display: none !important;
    }"""

if old_mobile_block in css:
    css = css.replace(old_mobile_block, new_mobile_block, 1)
    with open('CSS/company.css', 'w', encoding='utf-8') as f:
        f.write(css)
    print("Updated CSS/company.css mobile methodology styles successfully.")
else:
    # Try CRLF
    old_crlf = old_mobile_block.replace('\n', '\r\n')
    new_crlf = new_mobile_block.replace('\n', '\r\n')
    if old_crlf in css:
        css = css.replace(old_crlf, new_crlf, 1)
        with open('CSS/company.css', 'w', encoding='utf-8') as f:
            f.write(css)
        print("Updated CSS/company.css mobile methodology styles successfully with CRLF.")
    else:
        print("Failed to find old mobile block in CSS/company.css")
