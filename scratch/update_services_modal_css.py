with open('CSS/services.css', 'r', encoding='utf-8') as f:
    content = f.read()

target = """    .modal-spec-row {
        grid-template-columns: 1fr;
        gap: 4px;
    }"""

replacement = """    .modal-spec-row {
        grid-template-columns: 1fr;
        gap: 4px;
    }

    /* Modal Mobile Responsiveness */
    .atg-modal-backdrop {
        padding: 12px 10px;
    }

    .atg-modal-container {
        max-height: 94vh;
        border-radius: 16px;
    }

    .modal-gallery-column {
        padding: 18px 16px 14px;
    }

    .modal-details-column {
        padding: 18px 16px 28px;
    }

    .modal-design-title {
        font-size: 1.45rem;
    }

    .atg-modal-close-btn {
        top: 12px;
        right: 12px;
        width: 38px;
        height: 38px;
    }

    .modal-tabs-nav {
        gap: 6px;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 4px;
    }

    .modal-tab-btn {
        padding: 8px 12px;
        font-size: 0.78rem;
        white-space: nowrap;
    }

    .modal-cta-buttons-row {
        grid-template-columns: 1fr;
        gap: 10px;
    }"""

if target in content:
    content = content.replace(target, replacement, 1)
    with open('CSS/services.css', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully updated CSS/services.css")
else:
    # Try with CRLF
    target_crlf = target.replace('\n', '\r\n')
    replacement_crlf = replacement.replace('\n', '\r\n')
    if target_crlf in content:
        content = content.replace(target_crlf, replacement_crlf, 1)
        with open('CSS/services.css', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Successfully updated CSS/services.css with CRLF")
    else:
        print("Target not found in CSS/services.css")
