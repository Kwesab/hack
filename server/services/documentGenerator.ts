interface DocumentTemplate {
  type: "transcript" | "certificate" | "attestation";
  subType: string;
  content: string;
}

interface StudentData {
  name: string;
  studentId: string;
  email?: string;
  phone: string;
  program?: string;
  graduationYear?: string;
  gpa?: number;
}

interface RequestData {
  id: string;
  type: "transcript" | "certificate" | "attestation";
  subType: string;
  createdAt: Date;
  completedAt: Date;
}

class DocumentGenerator {
  private templates: Map<string, DocumentTemplate> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  private initializeTemplates() {
    // Transcript template
    this.templates.set("transcript-undergraduate", {
      type: "transcript",
      subType: "undergraduate",
      content: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Official Transcript - Takoradi Technical University</title>
    <style>
        body { font-family: 'Times New Roman', serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 3px solid #1e3a8a; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #1e3a8a; margin-bottom: 10px; }
        .subtitle { font-size: 16px; color: #666; }
        .document-title { font-size: 20px; font-weight: bold; text-align: center; margin: 30px 0; }
        .student-info { margin: 20px 0; }
        .info-row { display: flex; justify-content: space-between; margin: 10px 0; }
        .grades-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
        .grades-table th, .grades-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .grades-table th { background-color: #f2f2f2; font-weight: bold; }
        .footer { margin-top: 50px; text-align: center; }
        .signature-section { margin: 40px 0; display: flex; justify-content: space-between; }
        .signature-box { text-align: center; width: 200px; }
        .signature-line { border-bottom: 1px solid #000; margin-bottom: 5px; height: 40px; }
        .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 100px; color: rgba(30, 58, 138, 0.1); z-index: -1; }
    </style>
</head>
<body>
    <div class="watermark">TTU OFFICIAL</div>
    
    <div class="header">
        <div class="logo">🎓 TAKORADI TECHNICAL UNIVERSITY</div>
        <div class="subtitle">P.O. Box 256, Takoradi, Ghana</div>
        <div class="subtitle">Tel: +233-31-2022183 | Email: info@ttu.edu.gh</div>
    </div>

    <div class="document-title">OFFICIAL ACADEMIC TRANSCRIPT</div>

    <div class="student-info">
        <div class="info-row">
            <strong>Student Name:</strong>
            <span>{{STUDENT_NAME}}</span>
        </div>
        <div class="info-row">
            <strong>Student ID:</strong>
            <span>{{STUDENT_ID}}</span>
        </div>
        <div class="info-row">
            <strong>Program:</strong>
            <span>{{PROGRAM}}</span>
        </div>
        <div class="info-row">
            <strong>Date of Graduation:</strong>
            <span>{{GRADUATION_DATE}}</span>
        </div>
        <div class="info-row">
            <strong>Cumulative GPA:</strong>
            <span>{{GPA}}</span>
        </div>
    </div>

    <table class="grades-table">
        <thead>
            <tr>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>Credit Hours</th>
                <th>Grade</th>
                <th>Grade Points</th>
            </tr>
        </thead>
        <tbody>
            {{COURSE_RECORDS}}
        </tbody>
    </table>

    <div class="signature-section">
        <div class="signature-box">
            <div class="signature-line"></div>
            <div><strong>Registrar</strong></div>
            <div>{{ISSUE_DATE}}</div>
        </div>
        <div style="text-align: center;">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgc3Ryb2tlPSIjMWUzYThhIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiLz4KICA8dGV4dCB4PSI1MCIgeT0iNTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzFlM2E4YSI+VFRVPC90ZXh0Pgo8L3N2Zz4K" alt="TTU Seal" />
            <div><strong>Official Seal</strong></div>
        </div>
        <div class="signature-box">
            <div class="signature-line"></div>
            <div><strong>Dean of Academic Affairs</strong></div>
            <div>{{ISSUE_DATE}}</div>
        </div>
    </div>

    <div class="footer">
        <p style="font-size: 12px; color: #666;">
            This is an official transcript issued by Takoradi Technical University.<br>
            Request ID: {{REQUEST_ID}} | Generated on: {{GENERATION_DATE}}<br>
            For verification, contact: registrar@ttu.edu.gh | +233-31-2022183
        </p>
    </div>
</body>
</html>`;
    });

    // Certificate template
    this.templates.set("certificate-degree", {
      type: "certificate",
      subType: "degree",
      content: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Degree Certificate - Takoradi Technical University</title>
    <style>
        body { font-family: 'Times New Roman', serif; margin: 0; padding: 40px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); }
        .certificate { background: white; padding: 60px; border: 10px solid #1e3a8a; margin: 0 auto; max-width: 800px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 40px; }
        .university-name { font-size: 32px; font-weight: bold; color: #1e3a8a; margin-bottom: 10px; letter-spacing: 2px; }
        .subtitle { font-size: 16px; color: #666; margin-bottom: 5px; }
        .certificate-title { font-size: 28px; font-weight: bold; text-align: center; margin: 40px 0; color: #d97706; text-transform: uppercase; letter-spacing: 3px; }
        .recipient-section { text-align: center; margin: 40px 0; }
        .awarded-to { font-size: 18px; margin-bottom: 20px; }
        .recipient-name { font-size: 36px; font-weight: bold; color: #1e3a8a; margin: 20px 0; text-decoration: underline; }
        .degree-info { font-size: 20px; margin: 30px 0; line-height: 1.8; }
        .signature-section { display: flex; justify-content: space-between; margin-top: 60px; }
        .signature-box { text-align: center; width: 200px; }
        .signature-line { border-bottom: 2px solid #000; margin-bottom: 10px; height: 50px; }
        .date-box { text-align: center; margin: 40px 0; }
        .seal { text-align: center; margin: 30px 0; }
        .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 120px; color: rgba(30, 58, 138, 0.05); z-index: -1; }
    </style>
</head>
<body>
    <div class="watermark">TTU OFFICIAL</div>
    
    <div class="certificate">
        <div class="header">
            <div class="university-name">🎓 TAKORADI TECHNICAL UNIVERSITY</div>
            <div class="subtitle">Republic of Ghana</div>
            <div class="subtitle">Established 1968</div>
        </div>

        <div class="certificate-title">Certificate of Graduation</div>

        <div class="recipient-section">
            <div class="awarded-to">This is to certify that</div>
            <div class="recipient-name">{{STUDENT_NAME}}</div>
            <div class="degree-info">
                having satisfactorily completed all the requirements<br>
                prescribed by the University for the degree of<br><br>
                <strong style="font-size: 24px; color: #1e3a8a;">{{DEGREE_TITLE}}</strong><br><br>
                is hereby awarded this certificate with all the rights,<br>
                privileges and responsibilities thereunto appertaining.
            </div>
        </div>

        <div class="date-box">
            <div style="font-size: 18px;">
                Given at Takoradi this <strong>{{GRADUATION_DAY}}</strong> day of <strong>{{GRADUATION_MONTH}}</strong><br>
                in the year of our Lord <strong>{{GRADUATION_YEAR}}</strong>
            </div>
        </div>

        <div class="signature-section">
            <div class="signature-box">
                <div class="signature-line"></div>
                <div><strong>Vice-Chancellor</strong></div>
            </div>
            <div class="seal">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSI2MCIgY3k9IjYwIiByPSI1MCIgc3Ryb2tlPSIjMWUzYThhIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz4KICA8dGV4dCB4PSI2MCIgeT0iNTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzFlM2E4YSI+VFRVPC90ZXh0PgogIDx0ZXh0IHg9IjYwIiB5PSI3NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgiIGZpbGw9IiMxZTNhOGEiPkdIQU5BPC90ZXh0Pgo8L3N2Zz4K" alt="University Seal" />
                <div style="margin-top: 10px;"><strong>University Seal</strong></div>
            </div>
            <div class="signature-box">
                <div class="signature-line"></div>
                <div><strong>Registrar</strong></div>
            </div>
        </div>

        <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #666;">
            Certificate ID: {{REQUEST_ID}} | Issued: {{ISSUE_DATE}}<br>
            For verification: registrar@ttu.edu.gh | +233-31-2022183
        </div>
    </div>
</body>
</html>`;
    });

    // Attestation template
    this.templates.set("attestation-verification", {
      type: "attestation",
      subType: "verification",
      content: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Document Attestation - Takoradi Technical University</title>
    <style>
        body { font-family: 'Times New Roman', serif; margin: 40px; line-height: 1.8; }
        .letterhead { text-align: center; border-bottom: 2px solid #1e3a8a; padding-bottom: 20px; margin-bottom: 30px; }
        .university-name { font-size: 24px; font-weight: bold; color: #1e3a8a; }
        .address { font-size: 14px; color: #666; margin-top: 10px; }
        .document-title { font-size: 18px; font-weight: bold; text-align: center; margin: 30px 0; text-transform: uppercase; }
        .content { font-size: 16px; text-align: justify; }
        .student-details { background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-left: 4px solid #1e3a8a; }
        .signature-section { margin-top: 60px; }
        .signature-box { float: right; text-align: center; width: 250px; }
        .signature-line { border-bottom: 1px solid #000; margin-bottom: 5px; height: 40px; }
        .reference { margin-top: 40px; font-size: 12px; color: #666; }
        .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 80px; color: rgba(30, 58, 138, 0.1); z-index: -1; }
    </style>
</head>
<body>
    <div class="watermark">TTU VERIFIED</div>
    
    <div class="letterhead">
        <div class="university-name">🎓 TAKORADI TECHNICAL UNIVERSITY</div>
        <div class="address">
            Office of the Registrar<br>
            P.O. Box 256, Takoradi, Ghana<br>
            Tel: +233-31-2022183 | Email: registrar@ttu.edu.gh
        </div>
    </div>

    <div style="text-align: right; margin-bottom: 30px;">
        <strong>Date:</strong> {{ISSUE_DATE}}<br>
        <strong>Ref:</strong> TTU/REG/{{REQUEST_ID}}
    </div>

    <div class="document-title">Letter of Attestation</div>

    <div class="content">
        <p><strong>TO WHOM IT MAY CONCERN</strong></p>

        <p>This is to certify that the academic records and documents presented by the individual named below are authentic and have been verified by the Office of the Registrar, Takoradi Technical University.</p>

        <div class="student-details">
            <strong>Student Information:</strong><br>
            <strong>Full Name:</strong> {{STUDENT_NAME}}<br>
            <strong>Student ID:</strong> {{STUDENT_ID}}<br>
            <strong>Program of Study:</strong> {{PROGRAM}}<br>
            <strong>Period of Study:</strong> {{STUDY_PERIOD}}<br>
            <strong>Academic Status:</strong> {{ACADEMIC_STATUS}}
        </div>

        <p>The above-named individual was a bonafide student of this institution and has successfully completed the academic requirements for the program mentioned above. All transcripts, certificates, and related academic documents bearing the official seal and signature of this university are genuine and have been issued by the authorized office.</p>

        <p>This attestation is issued at the request of the student for {{ATTESTATION_PURPOSE}} and is valid for official use.</p>

        <p>Should you require any further verification or additional information, please do not hesitate to contact the Office of the Registrar.</p>

        <p>Thank you for your attention to this matter.</p>
    </div>

    <div class="signature-section">
        <div class="signature-box">
            <div class="signature-line"></div>
            <div><strong>{{REGISTRAR_NAME}}</strong></div>
            <div>Registrar</div>
            <div>Takoradi Technical University</div>
            <br>
            <div style="border: 2px solid #1e3a8a; padding: 10px; margin-top: 10px;">
                <strong>OFFICIAL SEAL</strong>
            </div>
        </div>
        <div style="clear: both;"></div>
    </div>

    <div class="reference">
        <hr style="margin: 40px 0 20px 0;">
        <p><strong>Verification Details:</strong><br>
        Document ID: {{REQUEST_ID}}<br>
        Generated: {{GENERATION_DATE}}<br>
        Status: Official and Verified<br>
        Digital Signature: {{DIGITAL_SIGNATURE}}</p>
    </div>
</body>
</html>`;
    });
  }

  generateDocument(
    student: StudentData,
    request: RequestData,
    additionalData?: any,
  ): string {
    const templateKey = `${request.type}-${request.subType.toLowerCase().replace(/\s+/g, "-")}`;
    const template = this.templates.get(templateKey);

    if (!template) {
      throw new Error(`Template not found for ${templateKey}`);
    }

    let documentHtml = template.content;

    // Common replacements
    const replacements: Record<string, string> = {
      "{{STUDENT_NAME}}": student.name.toUpperCase(),
      "{{STUDENT_ID}}": student.studentId,
      "{{REQUEST_ID}}": request.id,
      "{{ISSUE_DATE}}": new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      "{{GENERATION_DATE}}": new Date().toISOString(),
      "{{PROGRAM}}": student.program || "Computer Science",
      "{{GPA}}": student.gpa?.toString() || "3.45",
      "{{GRADUATION_DATE}}": student.graduationYear || "June 2024",
      "{{GRADUATION_YEAR}}": student.graduationYear?.split(" ")[1] || "2024",
      "{{GRADUATION_MONTH}}": student.graduationYear?.split(" ")[0] || "June",
      "{{GRADUATION_DAY}}":
        new Date().getDate().toString() +
        (new Date().getDate() > 10 && new Date().getDate() < 20
          ? "th"
          : ["th", "st", "nd", "rd"][new Date().getDate() % 10] || "th"),
      "{{DEGREE_TITLE}}": additionalData?.degreeTitle || "Bachelor of Technology in Computer Science",
      "{{STUDY_PERIOD}}": additionalData?.studyPeriod || "September 2020 - June 2024",
      "{{ACADEMIC_STATUS}}": additionalData?.academicStatus || "Graduate in Good Standing",
      "{{ATTESTATION_PURPOSE}}": additionalData?.purpose || "employment verification",
      "{{REGISTRAR_NAME}}": "Dr. Kwame Asante",
      "{{DIGITAL_SIGNATURE}}": this.generateDigitalSignature(request.id),
    };

    // Add sample course records for transcripts
    if (request.type === "transcript") {
      const courseRecords = this.generateSampleCourseRecords();
      replacements["{{COURSE_RECORDS}}"] = courseRecords;
    }

    // Apply all replacements
    Object.entries(replacements).forEach(([placeholder, value]) => {
      documentHtml = documentHtml.replace(new RegExp(placeholder, "g"), value);
    });

    return documentHtml;
  }

  private generateSampleCourseRecords(): string {
    const courses = [
      { code: "CS101", title: "Introduction to Computer Science", credits: 3, grade: "A", points: 12.0 },
      { code: "MATH101", title: "Calculus I", credits: 3, grade: "B+", points: 9.9 },
      { code: "ENG101", title: "Technical Writing", credits: 2, grade: "A-", points: 7.4 },
      { code: "CS201", title: "Data Structures and Algorithms", credits: 4, grade: "A", points: 16.0 },
      { code: "CS301", title: "Database Systems", credits: 3, grade: "B+", points: 9.9 },
      { code: "CS401", title: "Software Engineering", credits: 4, grade: "A-", points: 14.8 },
    ];

    return courses.map(course => `
      <tr>
        <td>${course.code}</td>
        <td>${course.title}</td>
        <td>${course.credits}</td>
        <td>${course.grade}</td>
        <td>${course.points}</td>
      </tr>
    `).join("");
  }

  private generateDigitalSignature(requestId: string): string {
    // Simple hash-like signature for demo purposes
    const timestamp = Date.now().toString();
    const combined = requestId + timestamp + "TTU_SECRET_KEY";
    
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(16).toUpperCase().substring(0, 8);
  }

  convertToPDF(html: string): Buffer {
    // In a real implementation, you would use a library like puppeteer or wkhtmltopdf
    // For this demo, we'll return the HTML as a buffer
    return Buffer.from(html, 'utf-8');
  }
}

export const documentGenerator = new DocumentGenerator();