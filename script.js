document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
    
    // Chart.js implementation
    const ctx = document.getElementById('challenges-chart');
    
    if (ctx) {
        // Data for the challenges
        const challengeData = {
            labels: [
                'Escolha de equipamentos inadequados',
                'Infraestrutura de rede insuficiente',
                'Falta de segurança de dados',
                'Ausência de backups',
                'Configurações ineficientes'
            ],
            values: [78, 65, 82, 70, 60],
            colors: [
                'rgba(59, 130, 246, 0.8)',  // blue-500
                'rgba(99, 102, 241, 0.8)',  // indigo-500
                'rgba(139, 92, 246, 0.8)',  // purple-500
                'rgba(79, 70, 229, 0.8)',   // indigo-600
                'rgba(37, 99, 235, 0.8)'    // blue-600
            ],
            serviceMap: [2, 3, 3, 3, 1] // Maps each challenge to a service ID
        };
        
        // Create the horizontal bar chart
        const challengesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: challengeData.labels,
                datasets: [{
                    label: 'Escritórios afetados (%)',
                    data: challengeData.values,
                    backgroundColor: challengeData.colors,
                    borderColor: challengeData.colors.map(color => color.replace('0.8', '1')),
                    borderWidth: 1,
                    borderRadius: 4,
                    barThickness: 20,
                }]
            },
            options: {
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.raw}% dos novos escritórios enfrentam este desafio`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                },
                maintainAspectRatio: false,
                responsive: true
            }
        });
        
        // Manter apenas o evento de clique para interação com o gráfico
        ctx.onclick = function(evt) {
            const points = challengesChart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
            
            if (points.length) {
                const firstPoint = points[0];
                const serviceId = challengeData.serviceMap[firstPoint.index];
                
                // Remove active class from all service cards
                document.querySelectorAll('.service-card').forEach(card => {
                    card.classList.remove('active');
                });
                
                // Add active class to the target service card
                const targetCard = document.querySelector(`.service-card[data-service-id='${serviceId}']`);
                if (targetCard) {
                    targetCard.classList.add('active');
                    targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        };
        
        // Adicionar interação com os cards de serviço
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('click', function() {
                // Remove active class from all service cards
                document.querySelectorAll('.service-card').forEach(c => {
                    c.classList.remove('active');
                });
                
                // Add active class to this card
                this.classList.add('active');
            });
        });
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        scrollObserver.observe(el);
    });
    
    // Adicionar classe fade-in aos elementos quando a página carrega
    document.querySelectorAll('.service-card, .challenge-card').forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('fade-in');
        }, index * 100); // Efeito cascata com delay
    });
    
    // Processamento do formulário de contato
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Prevenir o comportamento padrão do formulário (recarregar a página)
            e.preventDefault();
            
            // Obter o botão de envio e salvar o texto original
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            
            // Alterar o texto do botão e desabilitar durante o envio
            submitButton.innerHTML = 'Enviando...';
            submitButton.disabled = true;
            
            // Preparar os parâmetros do template
            const templateParams = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value
            };
            
            // Enviar o email usando EmailJS com suas chaves
            emailjs.send('service_42txvgd', 'template_lxi547m', templateParams, '3hJVCbwQwqXVfEjM2')
                .then(function(response) {
                    console.log('SUCESSO!', response.status, response.text);
                    
                    // Mostrar mensagem de sucesso
                    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                    
                    // Resetar o formulário
                    contactForm.reset();
                    
                    // Restaurar o botão
                    submitButton.innerHTML = originalButtonText;
                    submitButton.disabled = false;
                }, function(error) {
                    console.log('FALHOU...', error);
                    
                    // Mostrar mensagem de erro
                    alert('Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente ou entre em contato pelo WhatsApp.');
                    
                    // Restaurar o botão
                    submitButton.innerHTML = originalButtonText;
                    submitButton.disabled = false;
                });
        });
    }
    
    // Fundo tecnológico animado
    const canvas = document.getElementById('tech-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        // Ajustar o canvas quando a janela for redimensionada
        window.addEventListener('resize', function() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
        
        // Configuração das partículas
        const particlesArray = [];
        const numberOfParticles = 100;
        const colors = ['rgba(59, 130, 246, 0.5)', 'rgba(99, 102, 241, 0.5)', 'rgba(139, 92, 246, 0.5)'];
        
        // Classe para as partículas
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 5 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Rebater nas bordas
                if (this.x > width || this.x < 0) {
                    this.speedX = -this.speedX;
                }
                if (this.y > height || this.y < 0) {
                    this.speedY = -this.speedY;
                }
            }
            
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Criar partículas
        function init() {
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }
        
        // Conectar partículas próximas com linhas
        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    const dx = particlesArray[a].x - particlesArray[b].x;
                    const dy = particlesArray[a].y - particlesArray[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        opacityValue = 1 - (distance / 100);
                        ctx.strokeStyle = 'rgba(59, 130, 246, ' + opacityValue + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        // Animar as partículas
        function animate() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            connect();
            requestAnimationFrame(animate);
        }
        
        // Iniciar a animação
        init();
        animate();
    }
});