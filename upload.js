const rawCode = codeInput.value.trim().toLowerCase().replace(/\s+/g, '-');
const section = prompt("Enter your class/section (e.g., fyit, syit):")?.trim().toLowerCase() || 'general';
const code = `${rawCode}-${new Date().getFullYear()}-${section}`;
