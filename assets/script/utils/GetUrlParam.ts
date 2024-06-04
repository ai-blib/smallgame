export const getUrlParam = (name: string) => {
	const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
	const r = window.location.search.substr(1).match(reg);
	if (r != null) return r[2];
	return null;
};
