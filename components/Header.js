import React from "react";
import { Menu } from "semantic-ui-react";

const Header = (props) => (
    <Menu style={{ marginTop: '10px' }}>
        <Menu.Item name="Home">Home</Menu.Item>
        <Menu.Menu position="right">
            <Menu.Item name="Campaigns">Campaigns</Menu.Item>
            <Menu.Item name="add">+</Menu.Item>
        </Menu.Menu>
    </Menu >
);

export default Header;
