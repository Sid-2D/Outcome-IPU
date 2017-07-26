var Template = [
    // 0 h3 Name
    {
        "tag": "h3",
        "id": "Name",
        "style": "color: #999; animation: fadeIn 4s"
    },
    // 1 h4 Sem
    {
        "tag": "h4",
        "id": "Sem",
        "style": "color:#999; animation: fadeIn 3s; text-align: left; margin-left: 5px"
    },
    // 2 div-table
    {
        "tag": "div",
        "class": "table-responsive"
    },
    // 3 table
    {
        "tag": "table",
        "class": "table",
        "style": "color: #fff; animation: fadeIn 1s"
    },
    // 4 div resultFooter
    {
        "tag": "div",
        "id": "resultFooter",
        "style": "animation: fadeIn 4s;"
    },
    // 5 h4 Total
    {
        "tag": "h4",
        "id": "Total",
        "style": "color:#999; text-align: left; margin-left: 5px"
    },
    // 6 hr
    {
        "tag": "hr",
        "style": "margin: 0px; background-color: #999; width: 100%;"
    },
    // 7 div progress container
    {
        "tag": "div",
        "class": "load-3",
        "style": "margin: 7px; margin-bottom: 0px; animation: fadeIn 1s; z-index: -1;"
    },
    // 8 div progress lines
    {
        "tag": "div",
        "class": "line"
    },
    // 9 div rankContainer
    {
        "tag": "div",
        "style": "text-align: center; animation: fadeIn 3s"
    },
    // 10 button
    {
        "tag": "button",
        "class": "btn btn-success",
        "style": "z-index: -1; margin: 5px; left: 0"
    },
    // 11 button dropdown
    {
        "tag": "button",
        "class": "btn btn-secondary dropdown-toggle",
        "type": "button",
        "data-toggle": "dropdown",
        "aria-haspopup": "true",
        "aria-expanded": "false"
    },
    // 12 menu container
    {
        "tag": "div",
        "class": "dropdown-menu dropdown-menu-center"
    },
    // 13 button dropdown item
    {
        "tag": "button", 
        "class": "dropdown-item",
        "type": "button"
    },
    // 14 i tag for fa
    {
        "tag": "i",
        "class": "fa fa-plus-square",
        "aria-hidden": "true"
    },
    // 15 tdComp
    {
        "tag": "td",
        "colspan": "6",
        "class": "hiddenRow",
        "style": "padding: 0; background: #333"
    },
    // 16 divComp
    {
        "tag": "div",
        "class": "accordian-body collapse"
    },
    // 17 comp progress bar
    {
        "tag": "i",
        "class": "fa fa-cog fa-spin fa-3x fa-fw",
        "style": "z-index: -1;"
    },
    // 18 comp table
    {
        "tag": "table",
        "class": "table",
        "style": "color: #fff; animation: fadeIn 1s; background: #333"
    },
    // 19 chevron up
    {
        "tag": "i",
        "class": "fa fa-chevron-up",
        "aria-hidden": "true",
        "style": "color: #33cc33; font-size: 15px"
    },
    // 20 chevron down
    {
        "tag": "i",
        "class": "fa fa-chevron-down",
        "aria-hidden": "true",
        "style": "color: #cf3333; font-size: 15px"
    }
];

module.exports = Template;