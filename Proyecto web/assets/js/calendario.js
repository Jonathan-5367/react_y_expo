// calendario.js - Calendario dinámico con citas (VERSIÓN COMPATIBLE CON BD)

class DynamicCalendar {
    constructor() {
        this.currentDate = new Date();
        this.currentYear = this.currentDate.getFullYear();
        this.currentMonth = this.currentDate.getMonth();
        
        // Elementos del DOM
        this.calendarDays = document.getElementById('calendar-days');
        this.calendarDate = document.getElementById('calendar-date');
        this.prevButton = document.querySelector('.calendar__button--previous');
        this.nextButton = document.querySelector('.calendar__button--next');
        this.infoButton = document.querySelector('.calendar__button--info');
        this.modal = document.getElementById('appointments-modal');
        this.modalTitle = document.getElementById('modal-date-title');
        this.modalList = document.getElementById('modal-appointments-list');
        this.modalClose = document.querySelector('.modal__close');
        this.modalCloseBtn = document.querySelector('.modal__button--close');
        
        this.monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        
        this.dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        
        // Verificar si las variables globales están definidas
        this.userCitas = typeof userCitas !== 'undefined' ? userCitas : {};
        this.esAdministrador = typeof esAdministrador !== 'undefined' ? esAdministrador : false;
        this.pacienteId = typeof pacienteId !== 'undefined' ? pacienteId : 0;
        
        this.init();
    }

    init() {
        this.renderCalendar();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.prevButton.addEventListener('click', () => this.previousMonth());
        this.nextButton.addEventListener('click', () => this.nextMonth());
        this.infoButton.addEventListener('click', () => this.showInfo());
        this.modalClose.addEventListener('click', () => this.closeModal());
        this.modalCloseBtn.addEventListener('click', () => this.closeModal());
        
        // Cerrar modal al hacer clic fuera
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    }

    renderCalendar() {
        this.calendarDays.innerHTML = '';
        
        // Actualizar título del calendario
        this.updateCalendarTitle();
        
        // Obtener información del mes actual
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        // Obtener el último día del mes anterior
        const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0).getDate();
        
        // Obtener el día de la semana del primer día (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
        let firstDayWeekday = firstDay.getDay();
        
        // Convertir a nuestro sistema donde 0 = Lunes, 6 = Domingo
        firstDayWeekday = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;
        
        console.log(`Primer día del mes: ${firstDay.toLocaleDateString('es-ES')}`);
        console.log(`Día de la semana del primer día: ${firstDay.getDay()} (${this.dayNames[firstDay.getDay()]})`);
        console.log(`Días del mes anterior a mostrar: ${firstDayWeekday}`);
        
        // Agregar días del mes anterior
        for (let i = firstDayWeekday; i > 0; i--) {
            const day = prevMonthLastDay - i + 1;
            const dayElement = this.createDayElement(day, 'prev');
            this.calendarDays.appendChild(dayElement);
        }
        
        // Agregar días del mes actual
        const today = new Date();
        const currentDay = today.getDate();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = this.createDayElement(day, 'current');
            
            // Marcar día actual
            if (day === currentDay && 
                this.currentMonth === currentMonth && 
                this.currentYear === currentYear) {
                dayElement.classList.add('calendar__day--today');
            }
            
            this.calendarDays.appendChild(dayElement);
        }
        
        // Calcular los días del próximo mes a mostrar para completar la cuadrícula (6 semanas)
        const totalDaysDisplayed = firstDayWeekday + daysInMonth;
        const remainingDays = 35 - totalDaysDisplayed; // 5 semanas * 7 días = 35
        for (let day = 1; day <= remainingDays; day++) {
            const dayElement = this.createDayElement(day, 'next');
            this.calendarDays.appendChild(dayElement);
        }
    }

    createDayElement(day, type) {
        const dayElement = document.createElement('li');
        dayElement.className = 'calendar__day';
        
        let dateKey;
        let dayCitas = [];
        
        if (type === 'current') {
            dateKey = `${this.currentYear}-${(this.currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            
            // TODOS los usuarios (pacientes y administradores) ven TODAS las citas
            dayCitas = this.userCitas[dateKey] || [];
            
            dayElement.setAttribute('data-day', day);
        } else if (type === 'prev') {
            // Mes anterior
            let prevMonth = this.currentMonth - 1;
            let prevYear = this.currentYear;
            if (prevMonth < 0) {
                prevMonth = 11;
                prevYear = this.currentYear - 1;
            }
            dateKey = `${prevYear}-${(prevMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            dayElement.classList.add('calendar__day--prev-month');
        } else if (type === 'next') {
            // Mes siguiente
            let nextMonth = this.currentMonth + 1;
            let nextYear = this.currentYear;
            if (nextMonth > 11) {
                nextMonth = 0;
                nextYear = this.currentYear + 1;
            }
            dateKey = `${nextYear}-${(nextMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            dayElement.classList.add('calendar__day--next-month');
        }
        
        const dayInfo = document.createElement('div');
        dayInfo.className = 'day__info';
        dayInfo.innerHTML = `<h5>${day}</h5>`;
        
        // Agregar botón de más info si hay citas (para móviles) - solo para el mes actual
        if (type === 'current' && dayCitas.length > 0) {
            const moreButton = document.createElement('button');
            moreButton.innerHTML = '<i class="ri-more-2-fill"></i>';
            moreButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showDayAppointments(day, dayCitas);
            });
            dayInfo.appendChild(moreButton);
        }
        
        dayElement.appendChild(dayInfo);
        
        // Agregar lista de citas (para desktop) - solo para el mes actual
        if (type === 'current' && dayCitas.length > 0) {
            const appointmentsList = document.createElement('ul');
            appointmentsList.className = 'calendar__appointments';
            
            dayCitas.forEach(cita => {
                const appointmentItem = document.createElement('li');
                appointmentItem.className = `appointment__${cita.estado}`;
                
                const appointmentButton = document.createElement('button');
                appointmentButton.type = 'button';
                appointmentButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showAppointmentDetail(cita);
                });
                
                appointmentButton.innerHTML = `
                    <i class="ri-circle-fill"></i>
                    <span class="appointment-text">${this.formatTime(cita.fecha_hora)} - ${cita.motivo}</span>
                `;
                
                appointmentItem.appendChild(appointmentButton);
                appointmentsList.appendChild(appointmentItem);
            });
            
            dayElement.appendChild(appointmentsList);
            
            // Hacer clic en el día para mostrar citas
            dayElement.style.cursor = 'pointer';
            dayElement.addEventListener('click', () => {
                this.showDayAppointments(day, dayCitas);
            });
        } else if (type !== 'current') {
            // Para meses anterior y siguiente, no hacer clic
            dayElement.style.cursor = 'default';
        }
        
        return dayElement;
    }

    showDayAppointments(day, citas) {
        const dateStr = this.formatDate(day);
        
        // Personalizar título según el tipo de usuario
        if (this.esAdministrador) {
            this.modalTitle.textContent = `Todas las Citas del ${dateStr}`;
        } else {
            this.modalTitle.textContent = `Citas del ${dateStr}`;
        }
        
        this.modalList.innerHTML = '';
        
        if (citas.length === 0) {
            this.modalList.innerHTML = '<li class="no-appointments">No hay citas para este día</li>';
        } else {
            citas.forEach(cita => {
                const listItem = document.createElement('li');
                listItem.className = `appointment-item appointment-${cita.estado}`;
                
                const time = this.formatTime(cita.fecha_hora);
                const doctor = cita.doctor_nombre || 'Por asignar';
                
                // Información adicional para administradores
                let infoAdicional = '';
                if (this.esAdministrador) {
                    if (cita.paciente_nombre) {
                        infoAdicional += `<p><strong>Paciente:</strong> ${cita.paciente_nombre}</p>`;
                    }
                    if (cita.paciente_telefono) {
                        infoAdicional += `<p><strong>Teléfono:</strong> ${cita.paciente_telefono}</p>`;
                    }
                }
                
                listItem.innerHTML = `
                    <div class="appointment-header">
                        <strong>${time}</strong>
                        <span class="appointment-status status-${cita.estado}">${this.translateStatus(cita.estado)}</span>
                    </div>
                    <div class="appointment-details">
                        <p><strong>Procedimiento:</strong> ${cita.motivo}</p>
                        <p><strong>Doctor:</strong> ${doctor}</p>
                        ${infoAdicional}
                    </div>
                `;
                
                this.modalList.appendChild(listItem);
            });
        }
        
        this.modal.showModal();
    }

    showAppointmentDetail(cita) {
        const time = this.formatTime(cita.fecha_hora);
        const date = this.formatDate(new Date(cita.fecha_hora).getDate());
        const doctor = cita.doctor_nombre || 'Por asignar';
        
        // Información adicional para administradores
        let infoAdicional = '';
        if (this.esAdministrador) {
            if (cita.paciente_nombre) {
                infoAdicional += `<p><strong>Paciente:</strong> ${cita.paciente_nombre}</p>`;
            }
            if (cita.paciente_telefono) {
                infoAdicional += `<p><strong>Teléfono:</strong> ${cita.paciente_telefono}</p>`;
            }
        }
        
        this.modalTitle.textContent = `Detalles de la cita - ${date}`;
        this.modalList.innerHTML = `
            <li class="appointment-detail">
                <div class="detail-section">
                    <h4>Información de la Cita</h4>
                    <p><strong>Fecha y Hora:</strong> ${date} a las ${time}</p>
                    <p><strong>Procedimiento:</strong> ${cita.motivo}</p>
                    <p><strong>Doctor:</strong> ${doctor}</p>
                    ${infoAdicional}
                    <p><strong>Estado:</strong> <span class="status-${cita.estado}">${this.translateStatus(cita.estado)}</span></p>
                </div>
                <div class="detail-actions">
                    <a href="../admin/citas.php" class="action-button">Ver en Historial</a>
                </div>
            </li>
        `;
        
        this.modal.showModal();
    }

    formatDate(day) {
        const date = new Date(this.currentYear, this.currentMonth, day);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatTime(dateTimeStr) {
        const date = new Date(dateTimeStr);
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    translateStatus(status) {
        const statusMap = {
            'pendiente': 'Pendiente',
            'asignada': 'Asignada',
            'confirmada': 'Confirmada',
            'realizada': 'Realizada',
            'cancelada': 'Cancelada'
        };
        return statusMap[status] || status;
    }

    updateCalendarTitle() {
        this.calendarDate.textContent = `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
    }

    previousMonth() {
        this.currentMonth--;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.renderCalendar();
    }

    nextMonth() {
        this.currentMonth++;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        this.renderCalendar();
    }

    showInfo() {
        this.modalTitle.textContent = 'Información del Calendario';
        this.modalList.innerHTML = `
            <li class="info-item">
                <h4>Leyenda de Estados</h4>
                <div class="legend">
                    <div class="legend-item">
                        <span class="status-indicator status-pendiente"></span>
                        <span>Cita Pendiente</span>
                    </div>
                    <div class="legend-item">
                        <span class="status-indicator status-asignada"></span>
                        <span>Cita Asignada</span>
                    </div>
                    <div class="legend-item">
                        <span class="status-indicator status-confirmada"></span>
                        <span>Cita Confirmada</span>
                    </div>
                    <div class="legend-item">
                        <span class="status-indicator status-realizada"></span>
                        <span>Cita Realizada</span>
                    </div>
                    <div class="legend-item">
                        <span class="status-indicator status-cancelada"></span>
                        <span>Cita Cancelada</span>
                    </div>
                </div>
            </li>
            <li class="info-item">
                <p><strong>Nota:</strong> Los días con citas aparecen resaltados. Haz clic en un día para ver las citas programadas.</p>
            </li>
        `;
        this.modal.showModal();
    }

    closeModal() {
        this.modal.close();
    }
}

// Inicializar el calendario cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando calendario...');
    
    // Verificar que userCitas esté definido
    if (typeof userCitas === 'undefined') {
        console.warn('userCitas no está definido. El calendario se mostrará sin citas.');
        window.userCitas = {};
    }
    
    // Verificar que esAdministrador esté definido
    if (typeof esAdministrador === 'undefined') {
        console.warn('esAdministrador no está definido. Se asume que es paciente.');
        window.esAdministrador = false;
    }
    
    // Verificar que pacienteId esté definido
    if (typeof pacienteId === 'undefined') {
        console.warn('pacienteId no está definido. Se asume valor 0.');
        window.pacienteId = 0;
    }
    
    new DynamicCalendar();
});