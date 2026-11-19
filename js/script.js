const productTabs = document.querySelectorAll('.product-tab');
const productPanels = document.querySelectorAll('.product-panel');
const productSelect = document.querySelector('#product-select');
const quoteForm = document.querySelector('#quote-form');
const formNote = document.querySelector('#form-note');

function selectProduct(product, moveFocus = false) {
	productTabs.forEach((tab) => {
		const isSelected = tab.dataset.product === product;
		tab.classList.toggle('is-active', isSelected);
		tab.setAttribute('aria-selected', String(isSelected));
		tab.tabIndex = isSelected ? 0 : -1;
		if (isSelected && moveFocus) tab.focus();
	});

	productPanels.forEach((panel) => {
		const isSelected = panel.dataset.panel === product;
		panel.classList.toggle('is-active', isSelected);
		panel.hidden = !isSelected;
	});

	productSelect.value = product;
}

productTabs.forEach((tab, index) => {
	tab.addEventListener('click', () => selectProduct(tab.dataset.product));
	tab.addEventListener('keydown', (event) => {
		if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
		event.preventDefault();
		let nextIndex = index;
		if (event.key === 'ArrowRight') nextIndex = (index + 1) % productTabs.length;
		if (event.key === 'ArrowLeft') nextIndex = (index - 1 + productTabs.length) % productTabs.length;
		if (event.key === 'Home') nextIndex = 0;
		if (event.key === 'End') nextIndex = productTabs.length - 1;
		selectProduct(productTabs[nextIndex].dataset.product, true);
	});
});

document.querySelectorAll('[data-order]').forEach((button) => {
	button.addEventListener('click', () => {
		selectProduct(button.dataset.order);
		document.querySelector('#orcamento').scrollIntoView({ behavior: 'smooth' });
		document.querySelector('#customer-name').focus({ preventScroll: true });
	});
});

quoteForm.addEventListener('submit', (event) => {
	event.preventDefault();
	if (!quoteForm.reportValidity()) return;

	const formData = new FormData(quoteForm);
	const productName = productSelect.options[productSelect.selectedIndex].text;
	const message = [
		'Olá! Gostaria de pedir um orçamento.',
		`Nome: ${formData.get('name')}`,
		`Produto: ${productName}`,
		`Quantidade: ${formData.get('quantity')}`,
		`Detalhes: ${formData.get('details')}`
	].join('\n');

	formNote.textContent = 'Abrindo o WhatsApp com sua solicitação. Revise a mensagem e escolha o contato para enviar.';
	window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});