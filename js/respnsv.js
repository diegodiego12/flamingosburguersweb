 document.addEventListener('DOMContentLoaded', function () {
        const qtyInputs = document.querySelectorAll('.qty-input');
        const totalDisplay = document.getElementById('totalDisplay');
        const confirmBtn = document.getElementById('confirmOrder');
        let metodoPedido = "";
        // Elementos para manejo de método de pedido
        const btnMostrador = document.getElementById("btnMostrador");
        const btnDomicilio = document.getElementById("btnDomicilio");
        const formMostrador = document.getElementById("formMostrador");
        const formDomicilio = document.getElementById("formDomicilio");
        const inputAdicional = document.querySelectorAll('.item-extras');
        

        //Variables para sumar dobes carnes o restar carnes
        

        btnMostrador.addEventListener("click", () => {
            metodoPedido = "Mostrador";

            formMostrador.classList.remove("d-none");
            formDomicilio.classList.add("d-none");

            btnMostrador.classList.add("btn-rosa");
            btnDomicilio.classList.remove("btn-rosa");
        });

        btnDomicilio.addEventListener("click", () => {
            metodoPedido = "Domicilio";

            formDomicilio.classList.remove("d-none");
            formMostrador.classList.add("d-none");

            btnDomicilio.classList.add("btn-rosa");
            btnMostrador.classList.remove("btn-rosa");
        });

        // Ingredientes adicionales click
      document.querySelectorAll('.ingredient-chip').forEach(chip => {
        chip.addEventListener('click', function() {

          this.classList.toggle('active');
          const btnDobles = document.querySelectorAll("#doblecarne");
          updateTotal(); // Actualizar total cuando se cambie un ingrediente
        });
      });

        // Función para actualizar el total del pedido
      function updateTotal() {
        let total = 0;
        
        // Calcular total de hamburguesas por cantidad
        qtyInputs.forEach(input => {
          const qty = parseInt(input.value) || 0;
          const price = parseFloat(input.getAttribute('data-price'));
          total += qty * price;
          
          // Sumar ingredientes adicionales para este item
          if (qty > 0) {
            const container = input.closest('.list-group-item');
            const extras = container.querySelectorAll('.item-extras.active');
            const activeGroups = container.querySelectorAll('.ingredient-group.active');
            const aderezosactivos = document.querySelectorAll('.aderezo.active');

            aderezosactivos.forEach(aderezo => {
                const aderezosMax = aderezosactivos.length; // Limitar a 2 aderezos
                
                if (aderezosMax > 2) {
                  alert("Solo puedes seleccionar hasta 2 aderezos. Se desactivarán las opciones marcads. Por favor elige solo 2 aderezos.");
                  aderezo.classList.remove('active');
                }
              });

              activeGroups.forEach(group => {
                const level = parseInt(group.getAttribute('data-level')) || 1;
                const ingredientPrice = parseFloat(group.getAttribute('data-price')) || 0;
                total += qty * (level * ingredientPrice);
              });
            extras.forEach(extra => {
              const extraPrice = parseFloat(extra.getAttribute('data-price')) || 0;
              total += qty * extraPrice;
            });
              
              
          }
        });
        
        totalDisplay.innerText = `$${total.toFixed(2)}`;
      }

      // Manejo de botones de cantidad
      document.querySelectorAll('.ingredient-group').forEach(group => {
        const chip = group.querySelector('.ingredient-chip');
        const baseName = group.getAttribute('data-ingredient');

        chip.addEventListener('click', function () {
          const isActive = group.classList.contains('active');
          if (!isActive) {
            group.classList.add('active');
            group.setAttribute('data-level', '1');
            chip.innerText = baseName;
          } else {
            group.classList.remove('active');
            group.removeAttribute('data-level');
            chip.innerText = baseName;
          }
          updateTotal();
        });

        group.querySelectorAll('.chip-ctrl').forEach(ctrl => {
          ctrl.addEventListener('click', function (e) {
            e.stopPropagation();
            let level = parseInt(group.getAttribute('data-level')) || 1;
            const action = this.getAttribute('data-action');

            if (action === 'plus') {
              level = Math.min(3, level + 1);
            } else {
              level = level - 1;
            }

            if (level <= 0) {
              group.classList.remove('active');
              group.removeAttribute('data-level');
              chip.innerText = baseName;
            } else {
              group.classList.add('active');
              group.setAttribute('data-level', level);
              const prefix = level === 2 ? 'Doble ' : (level === 3 ? 'Triple ' : (level === 4 ? 'Cuádruple ' : ''));
              chip.innerText = prefix + baseName;
            }
            updateTotal();
          });
        });
      });

      document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const input = this.parentElement.querySelector('.qty-input');
          let val = parseInt(input.value) || 0;
          if (this.getAttribute('data-action') === 'plus') {
            val++;
          } else {
            val = Math.max(0, val - 1);
          }
          input.value = val;
          updateTotal();
        });
        });

        qtyInputs.forEach(input => {
        input.addEventListener('input', updateTotal);
      });
        // Manejo del envío del pedido
      confirmBtn.addEventListener('click', function () {
        let orderSummary = [];
        let total = 0;
        
        qtyInputs.forEach(input => {
          const qty = parseInt(input.value) || 0;
          if (qty > 0) {
            const name = input.getAttribute('data-name');
            const basePrice = parseFloat(input.getAttribute('data-price'));
            const container = input.closest('.list-group-item');
            const extras = container.querySelector('.item-extras').value.trim();
            const AderezosComplementos = container.querySelectorAll('.aderezo.active');
            
            // Obtener ingredientes adicionales seleccionados
            let itemPrice = basePrice;
            const activeGroups = container.querySelectorAll('.ingredient-group.active');
            let ingredientList = [];
            let aderezoList = [];
            let complementosAderezosList = [];

            activeGroups.forEach(group => {
              const level = parseInt(group.getAttribute('data-level')) || 1;
              const ingName = group.querySelector('.ingredient-chip').innerText;
              const ingPrice = parseFloat(group.getAttribute('data-price')) || 0;
              ingredientList.push(ingName);
              itemPrice += (level * ingPrice);
            });

            AderezosComplementos.forEach(aderezo => {
              const aderezoName = aderezo.innerText;
              complementosAderezosList.push(aderezoName);
            });


            
            let itemDetail = `${qty}x ${name}`;
            let details = [];
            if (ingredientList.length > 0) details.push(`Ingredientes Adicionales: ${ingredientList.join(', ')}`);
            if (complementosAderezosList.length > 0) details.push(`Aderezos: ${complementosAderezosList.join(', ')}`);
            if (extras) details.push(`Comentario: ${extras}`);
            
            if (details.length > 0) itemDetail += ` [${details.join(' | ')}]`;
            
            orderSummary.push(itemDetail);
            total += qty * itemPrice;
          }
        });

        if (orderSummary.length === 0) {
          alert('Por favor selecciona al menos un producto.');
        } else {
          let mensaje = 'Hola, buenas noches.\nQuisiera Ordenar:\n' + orderSummary.join('\n') + '\n\nTotal: $' + total.toFixed(2);
           if(metodoPedido === null || metodoPedido === "") {
            alert("Por favor selecciona un método de pedido (Mostrador o Domicilio).");
            return;

        }
        if (metodoPedido === "Mostrador") {
            let nombre = document.getElementById("nombreMostrador").value.trim() || "Mostrador";
            mensaje += `\nPedido para recoger en mostrador\nNombre: ${nombre}`;
        }

        if (metodoPedido === "Domicilio") {
            let nombre = document.getElementById("nombreDom").value.trim();
            let telefono = document.getElementById("telefonoDom").value.trim();
            let calle = document.getElementById("calleDom").value.trim();
            let entreCalles = document.getElementById("direccionDom").value.trim();
            let referencia = document.getElementById("referenciaDom").value.trim();
            if(nombre === "" || calle === "" || referencia === "" || telefono === "" || telefono.length !== 10 || entreCalles === "") {
                alert("Por favor completa tu nombre, calle, teléfono y referencia para el pedido a domicilio. El teléfono debe tener 10 dígitos.");
                return;

            }
            mensaje += `\nEntrega a domicilio`;
            mensaje += `\nNombre: ${nombre || "No especificado"}`;
            mensaje += `\nCalle: ${calle || "No especificada"}`;
            mensaje += `\nTeléfono: ${telefono || "No especificado"}`;
            mensaje += `\nEntre Calles: ${entreCalles || "No especificado"}`;
            mensaje += `\nReferencia: ${referencia || "Sin referencia"}`;
        }
          const encodedMessage = encodeURIComponent(mensaje);
          window.open(`https://wa.me/5219871161465?text=${encodedMessage}`, '_blank');

          
        }
      });
    });