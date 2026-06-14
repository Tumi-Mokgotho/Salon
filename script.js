// Shop WhatsApp number (South Africa)
const SHOP_WHATSAPP = "27796499879";

// Available time slots
const TIMES = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

// State
let currentStep = 'form';
let selectedTime = null;
let formData = {
  name: '',
  phone: '',
  date: new Date().toISOString().slice(0, 10),
  service: 'Wash & Blow-dry'
};

// DOM elements
const modal = document.getElementById('bookingModal');
const modalBody = document.getElementById('modalBody');

// Send WhatsApp confirmation to shop
function sendWhatsAppConfirmation(bookingDetails) {
  const { name, phone, service, date, time } = bookingDetails;
  const formattedDate = new Date(date).toDateString();

  const message = `*MOKGOTHO'S SALON*

*BOOKING CONFIRMATION*

*Name:* ${name}
*Phone:* ${phone}
*Service:* ${service}
*Date:* ${formattedDate}
*Time:* ${time}

Thank you for choosing Mokgotho's Salon!
Please arrive 5 minutes before your appointment.

142 Mercer St, Studio 4 · Polokwane
For changes: Reply to this message

*See you soon!*`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${SHOP_WHATSAPP}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
}

// Send confirmation to customer
function sendCustomerWhatsApp(bookingDetails) {
  const { name, service, date, time, customerPhone } = bookingDetails;
  const formattedDate = new Date(date).toDateString();

  let cleanPhone = customerPhone.replace(/\D/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '27' + cleanPhone.substring(1);
  }
  if (!cleanPhone.startsWith('27') && !cleanPhone.startsWith('+27')) {
    cleanPhone = '27' + cleanPhone;
  }

  const message = `*Mokgotho's Salon*

Your booking is confirmed!

*Service:* ${service}
*Date:* ${formattedDate}
*Time:* ${time}

142 Mercer St, Studio 4 · Polokwane

Thank you for choosing us!`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
}

// Attach service book buttons
function attachServiceButtons() {
  document.querySelectorAll('.book-link').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceName = btn.getAttribute('data-service');
      openModal(serviceName);
    });
  });
}

// Modal functions
function openModal(serviceVal) {
  if (serviceVal) formData.service = serviceVal;
  currentStep = 'form';
  selectedTime = null;
  renderFormStep();
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function renderFormStep() {
  const SERVICES_LIST = [
    "Wash & Blow-dry", "Braids", "Silk Press", "Weave Install",
    "Bridal Hair", "Deep Treatment", "Natural Styling", "Makeup"
  ];

  modalBody.innerHTML = `
    <form id="bookingForm">
      <div class="form-group">
        <label>Choose a Service</label>
        <select id="modalService">
          ${SERVICES_LIST.map(s => `<option ${formData.service === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="flex-row-2">
        <div class="form-group">
          <label>Full name</label>
          <input id="modalName" type="text" value="${formData.name}" placeholder="Lerato Nkosi" required>
        </div>
        <div class="form-group">
          <label>WhatsApp Number</label>
          <input id="modalPhone" type="tel" value="${formData.phone}" placeholder="(+27) 123 4567" required>
          <small style="font-size:0.6rem; color:var(--text-muted); display:block; margin-top:0.2rem;">We'll send confirmation here</small>
        </div>
      </div>
      <div class="form-group">
        <label>Date</label>
        <input id="modalDate" type="date" value="${formData.date}" min="${new Date().toISOString().slice(0, 10)}" required>
      </div>
      <div class="form-group">
        <label>Pick a time</label>
        <div id="timeSlots" class="time-grid"></div>
      </div>
      <button type="submit" class="btn-primary btn-full">Confirm Booking →</button>
    </form>
  `;

  const timeContainer = document.getElementById('timeSlots');
  TIMES.forEach(t => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `time-slot ${selectedTime === t ? 'selected' : ''}`;
    btn.textContent = t;
    btn.onclick = () => {
      selectedTime = t;
      renderFormStep();
    };
    timeContainer.appendChild(btn);
  });

  const formEl = document.getElementById('bookingForm');
  formEl.onsubmit = (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('modalName').value.trim();
    const phoneInput = document.getElementById('modalPhone').value.trim();
    const dateInput = document.getElementById('modalDate').value;
    const serviceSelect = document.getElementById('modalService').value;

    if (!nameInput || !phoneInput || !selectedTime) {
      alert('Please fill all fields and select a time.');
      return;
    }

    formData = {
      name: nameInput,
      phone: phoneInput,
      date: dateInput,
      service: serviceSelect
    };

    sendWhatsAppConfirmation({
      name: formData.name,
      phone: formData.phone,
      service: formData.service,
      date: formData.date,
      time: selectedTime
    });

    setTimeout(() => {
      sendCustomerWhatsApp({
        name: formData.name,
        service: formData.service,
        date: formData.date,
        time: selectedTime,
        customerPhone: formData.phone
      });
    }, 500);

    currentStep = 'done';
    renderDoneStep();
  };
}

function renderDoneStep() {
  modalBody.innerHTML = `
    <div class="success-state">
      <i data-lucide="check-circle-2" class="check-icon"></i>
      <h3 class="modal-title" style="font-size:1.8rem">Booking Confirmed!</h3>
      <p style="margin:1rem 0; color: var(--text-soft);">
        <strong>${formData.service}</strong><br>
        ${new Date(formData.date).toDateString()} at <strong>${selectedTime}</strong>
      </p>
      <p style="font-size:0.85rem; color:var(--text-muted);">
        A WhatsApp confirmation has been sent to:<br>
        <strong>${formData.phone}</strong>
      </p>
      <p style="font-size:0.75rem; color:var(--pink-primary); margin-top:0.8rem;">
        Please check your WhatsApp messages
      </p>
      <button id="doneBtn" class="btn-primary btn-full" style="margin-top:1rem">Done</button>
    </div>
  `;
  lucide.createIcons();
  document.getElementById('doneBtn')?.addEventListener('click', closeModal);
}

// Event listeners
document.getElementById('globalBookBtn')?.addEventListener('click', () => openModal(null));
document.getElementById('heroBookBtn')?.addEventListener('click', () => openModal(null));
document.getElementById('visitBookBtn')?.addEventListener('click', () => openModal(null));
document.getElementById('closeModalBtn')?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// Initialize
attachServiceButtons();
lucide.createIcons();
