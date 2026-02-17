 document.addEventListener('DOMContentLoaded', function () {
        const qtyInputs = document.querySelectorAll('.qty-input');
        const totalDisplay = document.getElementById('totalDisplay');
        const confirmBtn = document.getElementById('confirmOrder');
        let metodoPedido = "";
        const btnMostrador = document.getElementById("btnMostrador");
        const btnDomicilio = document.getElementById("btnDomicilio");
        const formMostrador = document.getElementById("formMostrador");
        const formDomicilio = document.getElementById("formDomicilio");
        const inputAdicional = document.querySelectorAll('.item-extras');

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

        // Ingredient chip click handler
      document.querySelectorAll('.ingredient-chip').forEach(chip => {
        chip.addEventListener('click', function() {
          this.classList.toggle('active');
          updateTotal(); // Actualizar total cuando se cambie un ingrediente
        });
      });

        // Función para actualizar el total del pedido
      function updateTotal() {
        let total = 0;
        
        // Calcular total de hamburguesass por cantidad
        qtyInputs.forEach(input => {
          const qty = parseInt(input.value) || 0;
          const price = parseFloat(input.getAttribute('data-price'));
          total += qty * price;
          
          // Sumar ingredientes adicionales para este item
          const container = input.closest('.list-group-item');
          if (container) {
            const activeChips = container.querySelectorAll('.ingredient-chip.active');
            activeChips.forEach(chip => {
              const chipPrice = parseFloat(chip.getAttribute('data-price')) || 0;
              total += qty * chipPrice; // Multiplicar por cantidad del item
            });
          }
        });
        
        totalDisplay.innerText = `$${total.toFixed(2)}`;
      }

      // Manejo de botones de cantidad
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
            const price = parseFloat(input.getAttribute('data-price'));
            const container = input.closest('.list-group-item');
            const extras = container.querySelector('.item-extras').value;
            
            // Get active ingredients
            const activeChips = container.querySelectorAll('.ingredient-chip.active');
            let ingredients = Array.from(activeChips).map(c => c.innerText);
            
            let itemDetail = `${qty}x ${name}`;
            let details = [];
            if (ingredients.length > 0) details.push(`Ingredientes Adicionales: ${ingredients.join(', ')}`);
            if (extras) details.push(`Comentario: ${extras}`);
            
            if (details.length > 0) itemDetail += ` [${details.join(' | ')}]`;
            
            orderSummary.push(itemDetail);
            total += qty * price;
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
            let direccion = document.getElementById("direccionDom").value.trim();
            let referencia = document.getElementById("referenciaDom").value.trim();
            if(nombre === "" || direccion === "" || referencia === "") {
                alert("Por favor completa tu nombre y dirección para el pedido a domicilio.");
                return;

            }
            mensaje += `\nEntrega a domicilio`;
            mensaje += `\nNombre: ${nombre || "No especificado"}`;
            mensaje += `\nDirección: ${direccion || "No especificada"}`;
            mensaje += `\nReferencia: ${referencia || "Sin referencia"}`;
        }
          const encodedMessage = encodeURIComponent(mensaje);
          window.open(`https://wa.me/5219871161465?text=${encodedMessage}`, '_blank');
        }
      });
    });