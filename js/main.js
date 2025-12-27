/**
 * Okahao Talitah Tutorial College - Main JavaScript
 * Handles navigation, form submission, and WhatsApp integration
 */

// WhatsApp number for registration submissions (Helena's number)
const WHATSAPP_NUMBER = '264817426267';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeRegistrationForm();
    initializeBackToTop();
});

/**
 * Navigation functionality
 */
function initializeNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const navbar = document.getElementById('navbar');

    // Mobile menu toggle
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const icon = this.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll effects and animations
 */
function initializeScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all section headers and cards
    document.querySelectorAll('.section-header, .subject-card, .fee-card, .session-card, .contact-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/**
 * Back to top button
 */
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Registration form handling
 */
function initializeRegistrationForm() {
    const form = document.getElementById('registrationForm');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate form
            if (!validateForm()) {
                return;
            }

            // Collect form data
            const formData = collectFormData();

            // Generate WhatsApp message
            const message = generateWhatsAppMessage(formData);

            // Send to WhatsApp
            sendToWhatsApp(message);
        });
    }
}

/**
 * Validate form fields
 */
function validateForm() {
    const fullName = document.getElementById('fullName').value.trim();
    const idNumber = document.getElementById('idNumber').value.trim();
    const dob = document.getElementById('dob').value;
    const phone = document.getElementById('phone').value.trim();
    const previousSchool = document.getElementById('previousSchool').value.trim();
    const session = document.querySelector('input[name="session"]:checked');
    const subjects = document.querySelectorAll('input[name="subjects"]:checked');

    let errors = [];

    if (!fullName) errors.push('Full Name is required');
    if (!idNumber) errors.push('ID Number is required');
    if (!dob) errors.push('Date of Birth is required');
    if (!phone) errors.push('Phone Number is required');
    if (!previousSchool) errors.push('Previous School is required');
    if (!session) errors.push('Please select a session preference');
    if (subjects.length === 0) errors.push('Please select at least one subject');

    if (errors.length > 0) {
        alert('Please fix the following errors:\n\n' + errors.join('\n'));
        return false;
    }

    return true;
}

/**
 * Collect form data
 */
function collectFormData() {
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        idNumber: document.getElementById('idNumber').value.trim(),
        dob: formatDate(document.getElementById('dob').value),
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim() || 'Not provided',
        previousSchool: document.getElementById('previousSchool').value.trim(),
        session: document.querySelector('input[name="session"]:checked').value,
        subjects: [],
        hostel: document.getElementById('hostel').checked ? 'Yes' : 'No',
        additionalInfo: document.getElementById('additionalInfo').value.trim() || 'None'
    };

    // Collect selected subjects
    document.querySelectorAll('input[name="subjects"]:checked').forEach(checkbox => {
        formData.subjects.push(checkbox.value);
    });

    return formData;
}

/**
 * Format date to readable format
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
}

/**
 * Generate WhatsApp message
 */
function generateWhatsAppMessage(formData) {
    // Calculate estimated monthly fee
    const monthlyFee = formData.subjects.length * 250;

    // Build subjects list with numbers
    let subjectsList = formData.subjects.map((subject, index) => {
        return `${index + 1}. ${subject}`;
    }).join('\n');

    const message = `*ONLINE REGISTRATION*
Okahao Talitah Tutorial College
==============================

*PERSONAL DETAILS*
Full Name: ${formData.fullName}
ID Number: ${formData.idNumber}
Date of Birth: ${formData.dob}
Phone: ${formData.phone}
Email: ${formData.email}

*EDUCATIONAL BACKGROUND*
Previous School: ${formData.previousSchool}

*SESSION PREFERENCE*
${formData.session}

*SUBJECTS REGISTERED FOR*
${subjectsList}

Total: ${formData.subjects.length} subject(s)

*ACCOMMODATION*
Hostel Required: ${formData.hostel}

*ADDITIONAL INFORMATION*
${formData.additionalInfo}

==============================
*FEE SUMMARY*
Registration Fee: N$250.00
Monthly Fee: N$${monthlyFee.toFixed(2)} (${formData.subjects.length} subjects x N$250)
==============================

_Submitted via OTTC Online Registration Form_`;

    return message;
}

/**
 * Send message to WhatsApp
 */
function sendToWhatsApp(message) {
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);

    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappURL, '_blank');

    // Show success message
    setTimeout(() => {
        alert('Registration form prepared! Please click "Send" in WhatsApp to complete your registration.\n\nIf WhatsApp did not open, please contact us directly at +264 81 742 6267');
    }, 500);
}

/**
 * Add active state to nav links based on scroll position
 */
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});

/**
 * Subject counter - show number of selected subjects
 */
document.addEventListener('DOMContentLoaded', function() {
    const subjectCheckboxes = document.querySelectorAll('input[name="subjects"]');
    const subjectHeader = document.querySelector('.form-section h4 .fa-book')?.parentElement;

    if (subjectCheckboxes.length > 0 && subjectHeader) {
        function updateSubjectCount() {
            const checkedCount = document.querySelectorAll('input[name="subjects"]:checked').length;
            const existingCounter = subjectHeader.querySelector('.subject-counter');

            if (checkedCount > 0) {
                if (existingCounter) {
                    existingCounter.textContent = `(${checkedCount} selected)`;
                } else {
                    const counter = document.createElement('span');
                    counter.className = 'subject-counter';
                    counter.style.cssText = 'font-size: 14px; color: #25D366; margin-left: 10px; font-weight: normal;';
                    counter.textContent = `(${checkedCount} selected)`;
                    subjectHeader.appendChild(counter);
                }
            } else if (existingCounter) {
                existingCounter.remove();
            }
        }

        subjectCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateSubjectCount);
        });
    }
});

/**
 * Form input animations
 */
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});

// Add console message for developers
console.log('%c Okahao Talitah Tutorial College ', 'background: #1a365d; color: #ffffff; font-size: 16px; padding: 10px;');
console.log('%c Website developed by Digital Wave Technologies ', 'background: #d4a017; color: #1a365d; font-size: 12px; padding: 5px;');
console.log('%c Contact: 0813214813 ', 'color: #718096; font-size: 11px;');
