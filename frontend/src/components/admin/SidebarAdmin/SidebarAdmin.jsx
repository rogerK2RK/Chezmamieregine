
import './style.css';



export default function SidebarAdmin() {

    function toggleDropdown(element) {
        const arrow = element.querySelector('.dropdown-arrow');
        const submenu = element.nextElementSibling;
        
        arrow.classList.toggle('expanded');
        submenu.classList.toggle('expanded');
    }

  return (
    <div class="sidebar">
        <div class="logo-section">
            <div class="logo-icon">👩‍🍳</div>
            <div class="logo-text">Chez maman Regine</div>
        </div>

        <div class="nav-section">
            <div class="section-title">Vendre</div>
            
            <div class="nav-item expandable" onclick={toggleDropdown(this)}>
                <span>
                    <span class="nav-icon">📚</span>
                    Catalogue
                </span>
                <span class="dropdown-arrow">▼</span>
            </div>
            <div class="submenu">
                <div class="submenu-item">Produits</div>
                <div class="submenu-item">Catégories</div>
            </div>

            <div class="nav-item">
                <span class="nav-icon">👥</span>
                Clients
            </div>

            <div class="nav-item">
                <span class="nav-icon">📦</span>
                Commandes
            </div>
        </div>

        <div class="bottom-section">
            <div class="nav-item">
                <span class="nav-icon">⚙️</span>
                Utilisateur
            </div>
        </div>
    </div>
    );
}
