 document.querySelectorAll('input[type="date"]').forEach(function(input) {
      input.addEventListener('click', function() {
        if (this.showPicker) this.showPicker();
      });
    });

    // CORRECCIÓN: Generar horarios solo para lunes a jueves
    document.getElementById('fecha').addEventListener('change', function() {
      const fecha = this.value;
      const horaSelect = document.getElementById('hora');
      
      if (!fecha) {
        horaSelect.innerHTML = '<option value="">Seleccione una fecha primero</option>';
        return;
      }
      
      // Validar que sea solo lunes a jueves
      const selectedDate = new Date(fecha);
      const dayOfWeek = selectedDate.getDay(); // 0 = Domingo, 1 = Lunes, 2 = Martes, 3 = Miércoles, 4 = Jueves, 5 = Viernes, 6 = Sábado
      
      // CORREGIDO: Solo permitir lunes (1) a jueves (4)
      if (dayOfWeek === 1 || dayOfWeek === 5 || dayOfWeek === 6) {
        horaSelect.innerHTML = '<option value="">No hay horarios disponibles (solo lunes a jueves)</option>';
        return;
      }
      
      // Generar horarios de 8:00 AM a 12:00 PM en intervalos de 30 minutos
      const horarios = [];
      for (let h = 8; h <= 12; h++) {
        for (let m = 0; m < 60; m += 30) {
          // No generar horas después de las 12:00
          if (h === 12 && m > 0) break;
          
          const hora = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
          horarios.push(hora);
        }
      }
      
      horaSelect.innerHTML = '<option value="">Seleccione una hora</option>';
      horarios.forEach(hora => {
        const option = document.createElement('option');
        option.value = hora;
        option.textContent = hora;
        horaSelect.appendChild(option);
      });
    });

    // Validación adicional del formulario
    document.querySelector('form').addEventListener('submit', function(e) {
      const fecha = document.getElementById('fecha').value;
      const hora = document.getElementById('hora').value;
      const procedimiento = document.getElementById('procedimiento').value;
      
      if (!fecha || !hora || !procedimiento) {
        e.preventDefault();
        alert('Por favor, complete todos los campos requeridos.');
        return;
      }
      
      // Validar fecha no sea en el pasado
      const selectedDate = new Date(fecha + 'T' + hora);
      if (selectedDate < new Date()) {
        e.preventDefault();
        alert('No puede agendar citas en el pasado.');
        return;
      }

      // CORREGIDO: Validar que sea lunes a jueves también en el envío del formulario
      const dayOfWeek = new Date(fecha).getDay();
      if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
        e.preventDefault();
        alert('Solo puede agendar citas de lunes a jueves.');
        return;
      }
    });