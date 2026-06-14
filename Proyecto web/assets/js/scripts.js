// scripts.js - Versión MEJORADA con funcionalidades REALES
document.addEventListener('DOMContentLoaded', function() {
    console.log('Consultorio Dra. Nazaret López - Sistema cargado');

    // ===== 1. BANNER DE HORARIO INTELIGENTE =====
    function actualizarEstadoHorario() {
        const banner = document.querySelector('.horario-banner');
        if (!banner) return;

        const ahora = new Date();
        const dia = ahora.getDay(); // 0=Domingo, 1=Lunes...
        const hora = ahora.getHours();
        const minutos = ahora.getMinutes();

        // Verificar si estamos en horario laboral (Lunes-Jueves, 9:00-12:30)
        const estaAbierto = (dia >= 1 && dia <= 4) && 
                           ((hora === 9 && minutos >= 0) || 
                            (hora > 9 && hora < 12) || 
                            (hora === 12 && minutos <= 30));

        if (estaAbierto) {
            banner.innerHTML = '<p>✅ <strong>¡ABIERTO AHORA!</strong> Horario: Lunes a Jueves 9:00 AM - 12:30 PM</p>';
            banner.style.backgroundColor = '#d4edda';
        } else {
            banner.innerHTML = '<p>⏳ <strong>Cerrado en este momento</strong> - Horario: Lunes a Jueves 9:00 AM - 12:30 PM</p>';
            banner.style.backgroundColor = '#fff3cd';
        }
    }

    // ===== 2. SCROLL SUAVE PARA NAVEGACIÓN =====
    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== 3. ANIMACIÓN EN TARJETAS DE SERVICIOS =====
    const servicios = document.querySelectorAll('.servicio, .especialidad');
    
    servicios.forEach(servicio => {
        servicio.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
            this.style.transition = 'all 0.3s ease';
        });

        servicio.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // ===== 4. CONTADOR DE ESPECIALIDADES (efecto visual) =====
    const especialidades = document.querySelectorAll('.especialidad');
    let delay = 0;
    
    especialidades.forEach((especialidad, index) => {
        especialidad.style.opacity = '0';
        especialidad.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            especialidad.style.transition = 'all 0.6s ease';
            especialidad.style.opacity = '1';
            especialidad.style.transform = 'translateY(0)';
        }, delay);
        
        delay += 200; // Efecto cascada
    });

    // ===== 5. BOTÓN "AGENDAR CITA" MEJORADO =====
    const botonAgendar = document.querySelector('.hero .btn');
    if (botonAgendar) {
        botonAgendar.addEventListener('click', function(e) {
            // Podemos agregar analytics o confirmación aquí
            console.log('Usuario intentó agendar cita desde el hero');
        });
    }

    // ===== 6. DETECCIÓN DE SCROLL PARA HEADER =====
    let ultimoScroll = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        const scrollActual = window.pageYOffset;

        if (scrollActual > ultimoScroll && scrollActual > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        ultimoScroll = scrollActual;
    });

    // Ejecutar funciones iniciales
    actualizarEstadoHorario();
    
    // Actualizar horario cada minuto
    setInterval(actualizarEstadoHorario, 60000);
});