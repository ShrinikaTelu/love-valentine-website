// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Page 1 Logic
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    
    if (yesBtn && noBtn) {
        // YES button click - navigate to greeting cards page
        yesBtn.addEventListener('click', function() {
            // Add a little celebration effect before navigating
            this.textContent = '💖 YAY! 💖';
            this.style.transform = 'scale(1.2)';
            
            setTimeout(() => {
                window.location.href = 'greeting-cards.html';
            }, 500);
        });
        
        // NO button - run away on hover
        noBtn.addEventListener('mouseenter', function() {
            moveNoButton();
        });
        
        // Also handle touch for mobile
        noBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            moveNoButton();
        });
        
        // Function to move the NO button to a random position
        function moveNoButton() {
            const button = noBtn;
            const buttonWidth = button.offsetWidth;
            const buttonHeight = button.offsetHeight;
            
            // Get viewport dimensions with some padding
            const padding = 20;
            const maxX = window.innerWidth - buttonWidth - padding;
            const maxY = window.innerHeight - buttonHeight - padding;
            
            // Generate random position
            const randomX = Math.max(padding, Math.random() * maxX);
            const randomY = Math.max(padding, Math.random() * maxY);
            
            // Apply the new position with smooth animation
            button.style.position = 'fixed';
            button.style.left = randomX + 'px';
            button.style.top = randomY + 'px';
            button.style.transition = 'all 0.2s ease-out';
            
            // Add a playful rotation
            const randomRotation = (Math.random() - 0.5) * 30;
            button.style.transform = `rotate(${randomRotation}deg)`;
            
            // Change button text occasionally for fun
            const funnyTexts = ['NO 💔', 'Nope! 😜', 'Try again! 🏃', 'Can\'t catch me! 😝', 'Not today! 🙈', 'Haha! 😂'];
            button.textContent = funnyTexts[Math.floor(Math.random() * funnyTexts.length)];
        }
    }
});

// Page 2 Logic - Multiple Plan Selection
let selectedPlans = new Set();

const planDetails = {
    'Movie': { icon: '🎬', time: '6:00 PM - 10:00 PM', order: 6, items: ['🎟️ Book tickets in advance', '🍿 Get popcorn & drinks', '🎭 Watch a romantic movie', '🍦 Ice cream after the show'] },
    'Candle Light Dinner': { icon: '🕯️', time: '7:00 PM - 10:00 PM', order: 7, items: ['🍷 Reserve a cozy table', '🕯️ Romantic ambiance', '🍝 Delicious multi-course meal', '🎵 Soft music & conversations'] },
    'Temple': { icon: '🙏', time: '5:00 AM - 8:00 AM', order: 1, items: ['🌅 Early morning blessings', '🙏 Peaceful prayers together', '🌸 Offer flowers', '☕ Breakfast at a local café'] },
    'Game Zone': { icon: '🎮', time: '4:00 PM - 8:00 PM', order: 5, items: ['🕹️ Arcade games challenge', '🎯 Win prizes for each other', '🏎️ Racing games', '🍕 Pizza & gaming snacks'] },
    'Beach Walk': { icon: '🏖️', time: '4:00 PM - 7:00 PM', order: 4, items: ['🌊 Walk along the shore', '🐚 Collect seashells', '🌅 Watch the sunset', '🥥 Fresh coconut water'] },
    'Amusement Park': { icon: '🎡', time: '11:00 AM - 6:00 PM', order: 3, items: ['🎢 Thrilling roller coasters', '🎡 Romantic Ferris wheel ride', '🍭 Cotton candy & treats', '📸 Fun photo booth pictures'] },
    'Café Hopping': { icon: '☕', time: '3:00 PM - 7:00 PM', order: 4, items: ['☕ Try different coffees', '🥐 Share delicious pastries', '📖 Cozy conversations', '📸 Aesthetic café photos'] },
    'Stargazing': { icon: '🌟', time: '8:00 PM - 11:00 PM', order: 8, items: ['🔭 Find a perfect spot', '⭐ Spot constellations', '🌙 Make wishes together', '🧺 Picnic under the stars'] },
    'Art Class': { icon: '🎨', time: '2:00 PM - 5:00 PM', order: 3, items: ['🖌️ Join a painting workshop', '🎨 Create art together', '🖼️ Take home your masterpiece', '☕ Coffee & art chat'] },
    'Boating': { icon: '🛶', time: '4:00 PM - 6:00 PM', order: 4, items: ['🚣 Rent a boat', '🌅 Paddle through calm waters', '📸 Beautiful photo moments', '🍦 Ice cream by the lake'] },
    'Cook Together': { icon: '🍳', time: '5:00 PM - 9:00 PM', order: 6, items: ['🛒 Shop for ingredients', '👨‍🍳 Cook a special meal', '🕯️ Set up a home dinner', '🎵 Dance in the kitchen'] },
    'Karaoke Night': { icon: '🎤', time: '7:00 PM - 11:00 PM', order: 7, items: ['🎤 Book a karaoke room', '🎵 Sing favorite duets', '🍹 Drinks & snacks', '💃 Dance between songs'] }
};

function togglePlan(planName) {
    const card = document.querySelector(`[data-plan="${planName}"]`);
    const checkbox = card.querySelector('input[type="checkbox"]');
    
    if (selectedPlans.has(planName)) {
        selectedPlans.delete(planName);
        card.classList.remove('selected');
        checkbox.checked = false;
    } else {
        selectedPlans.add(planName);
        card.classList.add('selected');
        checkbox.checked = true;
    }
    
    updateSelectionUI();
}

function updateSelectionUI() {
    const countEl = document.getElementById('selectedCount');
    const btn = document.getElementById('createItineraryBtn');
    const count = selectedPlans.size;
    
    if (countEl) countEl.textContent = count;
    if (btn) {
        btn.disabled = count === 0;
        if (count > 0) {
            btn.textContent = `✨ Create Itinerary (${count})`;
        } else {
            btn.textContent = '✨ Create Itinerary';
        }
    }
}

function createCombinedItinerary() {
    if (selectedPlans.size === 0) return;
    
    // Sort plans by time order
    const sortedPlans = Array.from(selectedPlans).sort((a, b) => {
        return planDetails[a].order - planDetails[b].order;
    });
    
    showCombinedItinerary(sortedPlans);
}

function showCombinedItinerary(plans) {
    const modal = document.getElementById('itineraryModal');
    const content = document.getElementById('itineraryContent');
    
    const valentineDate = 'February 14, 2026';
    
    let plansHTML = plans.map((planName, index) => {
        const plan = planDetails[planName];
        return `
            <div class="itinerary-plan-item">
                <div class="plan-number">${index + 1}</div>
                <div class="plan-info">
                    <div class="plan-header">
                        <span class="plan-icon-small">${plan.icon}</span>
                        <span class="plan-name-small">${planName}</span>
                    </div>
                    <div class="plan-time-small">⏰ ${plan.time}</div>
                    <ul class="plan-items-small">
                        ${plan.items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }).join('');
    
    const itineraryHTML = `
        <div class="itinerary-header">
            <h2>💕 Valentine's Date Itinerary 💕</h2>
            <p class="date">📅 ${valentineDate}</p>
            <p class="activities-count">${plans.length} amazing activities planned!</p>
        </div>
        
        <div class="itinerary-timeline">
            ${plansHTML}
        </div>
        
        <div class="love-note">
            💖 "A perfect day filled with love, laughter, and unforgettable moments together!" 💖
        </div>
    `;
    
    content.innerHTML = itineraryHTML;
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('itineraryModal');
    modal.classList.remove('show');
}

function downloadItinerary() {
    if (selectedPlans.size === 0) return;
    
    const valentineDate = 'February 14, 2026';
    const sortedPlans = Array.from(selectedPlans).sort((a, b) => {
        return planDetails[a].order - planDetails[b].order;
    });
    
    let plansText = sortedPlans.map((planName, index) => {
        const plan = planDetails[planName];
        return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ${index + 1}. ${plan.icon} ${planName.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⏰ Time: ${plan.time}
  
  📋 Activities:
${plan.items.map(item => `     ${item}`).join('\n')}
`;
    }).join('\n');
    
    const itineraryText = `
╔═══════════════════════════════════════════╗
║    💕 VALENTINE'S DATE ITINERARY 💕       ║
╚═══════════════════════════════════════════╝

📅 Date: ${valentineDate}
🎯 Total Activities: ${sortedPlans.length}

${plansText}

═══════════════════════════════════════════

💖 "A perfect day filled with love, laughter, 
    and unforgettable moments together!" 💖

═══════════════════════════════════════════
           Made with love 💕
═══════════════════════════════════════════
    `;
    
    // Create downloadable file
    const blob = new Blob([itineraryText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Valentine_Itinerary_${sortedPlans.length}_Activities.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show feedback
    const btn = document.querySelector('.btn-download');
    const originalText = btn.textContent;
    btn.textContent = '✅ Downloaded!';
    setTimeout(() => {
        btn.textContent = originalText;
    }, 2000);
}

function sendEmail() {
    if (selectedPlans.size === 0) return;
    
    const email = 'shrinika.telu@gmail.com';
    const valentineDate = 'February 14, 2026';
    const sortedPlans = Array.from(selectedPlans).sort((a, b) => {
        return planDetails[a].order - planDetails[b].order;
    });
    
    const subject = encodeURIComponent(`💕 Valentine's Date Itinerary - ${sortedPlans.length} Activities Planned!`);
    
    let plansText = sortedPlans.map((planName, index) => {
        const plan = planDetails[planName];
        return `
${index + 1}. ${plan.icon} ${planName}
   ⏰ ${plan.time}
   ${plan.items.join('\n   ')}
`;
    }).join('\n');
    
    const body = encodeURIComponent(`
💕 VALENTINE'S DATE ITINERARY 💕
════════════════════════════════

📅 Date: ${valentineDate}
🎯 Total Activities: ${sortedPlans.length}

${plansText}

════════════════════════════════

💖 "A perfect day filled with love, laughter, and unforgettable moments together!" 💖

Made with love 💕
    `);
    
    // Open email client
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    
    // Show feedback
    const btn = document.querySelector('.btn-email');
    const originalText = btn.textContent;
    btn.textContent = '✅ Opening Email...';
    btn.classList.add('email-sent');
    setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('email-sent');
    }, 3000);
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('itineraryModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Add floating hearts animation
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = ['💕', '💗', '💖', '💝', '❤️', '💘'][Math.floor(Math.random() * 6)];
    heart.style.position = 'fixed';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.top = '100vh';
    heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
    heart.style.opacity = '0.7';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '0';
    heart.style.animation = 'floatUp 4s ease-out forwards';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 4000);
}

// Add the floating animation style dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.7;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Create floating hearts periodically
setInterval(createFloatingHeart, 800);

// ========== GREETING CARDS CAROUSEL ==========
let currentCardIndex = 0;
const greetingCards = document.querySelectorAll('.greeting-card');
const dots = document.querySelectorAll('.dot');

function updateCarousel() {
    greetingCards.forEach((card, index) => {
        card.classList.remove('active', 'prev', 'next');
        if (index === currentCardIndex) {
            card.classList.add('active');
        } else if (index < currentCardIndex) {
            card.classList.add('prev');
        } else {
            card.classList.add('next');
        }
    });
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentCardIndex);
    });
}

function nextCard() {
    if (greetingCards.length === 0) return;
    currentCardIndex = (currentCardIndex + 1) % greetingCards.length;
    updateCarousel();
}

function prevCard() {
    if (greetingCards.length === 0) return;
    currentCardIndex = (currentCardIndex - 1 + greetingCards.length) % greetingCards.length;
    updateCarousel();
}

function goToCard(index) {
    if (greetingCards.length === 0) return;
    currentCardIndex = index;
    updateCarousel();
}

// Touch swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

const carouselContainer = document.querySelector('.greeting-cards-container');
if (carouselContainer) {
    carouselContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carouselContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextCard();
        } else {
            prevCard();
        }
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (greetingCards.length === 0) return;
    if (e.key === 'ArrowRight') nextCard();
    if (e.key === 'ArrowLeft') prevCard();
});

