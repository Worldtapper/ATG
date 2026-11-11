with open('company.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Pane 1
p1_old = """                                    <div class="co-deliverable-chips">
                                        <span class="co-chip"><span class="co-chip-bullet"></span> Dimensional Site Survey</span>
                                        <span class="co-chip"><span class="co-chip-bullet"></span> Spatial Brief Alignment</span>
                                        <span class="co-chip"><span class="co-chip-bullet"></span> Feasibility Evaluation</span>
                                    </div>
                                </div>
                            </div>"""

p1_new = """                                    <div class="co-deliverable-chips">
                                        <span class="co-chip"><span class="co-chip-bullet"></span> Dimensional Site Survey</span>
                                        <span class="co-chip"><span class="co-chip-bullet"></span> Spatial Brief Alignment</span>
                                        <span class="co-chip"><span class="co-chip-bullet"></span> Feasibility Evaluation</span>
                                    </div>
                                </div>
                                <div class="co-stage-mobile-visual">
                                    <span class="co-viewfinder-corner top-left"></span>
                                    <span class="co-viewfinder-corner top-right"></span>
                                    <span class="co-viewfinder-corner bottom-left"></span>
                                    <span class="co-viewfinder-corner bottom-right"></span>
                                    <img src="images/477207b1-285c-4915-88f1-40f09fe9c256.jpg" alt="Phase 01 Architectural site survey" loading="lazy">
                                    <div class="co-mobile-img-badge">Phase 01 &bull; Discovery</div>
                                </div>
                            </div>"""

# Pane 2
p2_old = """                                    <div class="co-deliverable-chips">
                                        <span class="co-chip"><span class="co-chip-bullet"></span> Technical Shop Drawings</span>
                                        <span class="co-chip"><span class="co-chip-bullet"></span> Material &amp; Patina Samples</span>
                                        <span class="co-chip"><span class="co-chip-bullet"></span> 3D Structural Modeling</span>
                                    </div>
                                </div>
                            </div>"""

p2_new = """                                    <div class="co-deliverable-chips">
                                        <span class="co-chip"><span class="co-chip-bullet"></span> Technical Shop Drawings</span>
                                        <span class="co-chip"><span class="co-chip-bullet"></span> Material &amp; Patina Samples</span>
                                        <span class="co-chip"><span class="co-chip-bullet"></span> 3D Structural Modeling</span>
                                    </div>
                                </div>
                                <div class="co-stage-mobile-visual">
                                    <span class="co-viewfinder-corner top-left"></span>
                                    <span class="co-viewfinder-corner top-right"></span>
                                    <span class="co-viewfinder-corner bottom-left"></span>
                                    <span class="co-viewfinder-corner bottom-right"></span>
                                    <img src="images/service_steel.png" alt="Phase 02 Structural engineering and design" loading="lazy">
                                    <div class="co-mobile-img-badge">Phase 02 &bull; Engineering</div>
                                </div>
                            </div>"""

# Pane 3
p3_old = """                                    <div class="co-deliverable-chips">
                                        <span class="co-chip"><span class="co-chip-bullet"></span> CNC Profile Cutting</span>
                                        <span class="co-chip"><span class="co-chip-bullet"></span> Welded Sub-Assemblies</span>
                                        <span class="co-chip"><span class="co-chip-bullet"></span> Workshop Bench Fitting</span>
                                    </div>
                                </div>
                            </div>"""

p3_new = """                                    <div class="co-deliverable-chips">
                                        <span class="co-chip"><span class="co-chip-bullet"></span> CNC Profile Cutting</span>
                                        <span class="co-chip"><span class="co-chip-bullet"></span> Welded Sub-Assemblies</span>
                                        <span class="co-chip"><span class="co-chip-bullet"></span> Workshop Bench Fitting</span>
                                    </div>
                                </div>
                                <div class="co-stage-mobile-visual">
                                    <span class="co-viewfinder-corner top-left"></span>
                                    <span class="co-viewfinder-corner top-right"></span>
                                    <span class="co-viewfinder-corner bottom-left"></span>
                                    <span class="co-viewfinder-corner bottom-right"></span>
                                    <img src="images/e5c07175-a404-44a3-993f-c502c40bee47.png" alt="Phase 03 Workshop fabrication and welding" loading="lazy">
                                    <div class="co-mobile-img-badge">Phase 03 &bull; Fabrication</div>
                                </div>
                            </div>"""

# Pane 4
p4_old = """                                    <div class="co-deliverable-chips">
                                        <span class="co-chip"><span class="co-chip-bullet"></span> Protective Surface Coat</span>
                                        <span class="co-chip"><span class="co-chip-bullet"></span> Crated Logistics Transport</span>
                                        <span class="co-chip"><span class="co-chip-bullet"></span> Calibrated Site Handover</span>
                                    </div>
                                </div>
                            </div>"""

p4_new = """                                    <div class="co-deliverable-chips">
                                        <span class="co-chip"><span class="co-chip-bullet"></span> Protective Surface Coat</span>
                                        <span class="co-chip"><span class="co-chip-bullet"></span> Crated Logistics Transport</span>
                                        <span class="co-chip"><span class="co-chip-bullet"></span> Calibrated Site Handover</span>
                                    </div>
                                </div>
                                <div class="co-stage-mobile-visual">
                                    <span class="co-viewfinder-corner top-left"></span>
                                    <span class="co-viewfinder-corner top-right"></span>
                                    <span class="co-viewfinder-corner bottom-left"></span>
                                    <span class="co-viewfinder-corner bottom-right"></span>
                                    <img src="images/dropdown_portfolio.png" alt="Phase 04 Completed luxury installation" loading="lazy">
                                    <div class="co-mobile-img-badge">Phase 04 &bull; Installation</div>
                                </div>
                            </div>"""

changed = 0
for old, new, name in [(p1_old, p1_new, 'p1'), (p2_old, p2_new, 'p2'), (p3_old, p3_new, 'p3'), (p4_old, p4_new, 'p4')]:
    if old in html:
        html = html.replace(old, new, 1)
        changed += 1
        print(f"Replaced {name}")
    else:
        # try CRLF
        old_crlf = old.replace('\n', '\r\n')
        new_crlf = new.replace('\n', '\r\n')
        if old_crlf in html:
            html = html.replace(old_crlf, new_crlf, 1)
            changed += 1
            print(f"Replaced {name} (CRLF)")
        else:
            print(f"Failed to find {name}")

if changed == 4:
    with open('company.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("All 4 panes updated in company.html successfully!")
else:
    print(f"Only {changed}/4 panes replaced!")
