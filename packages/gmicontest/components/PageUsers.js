import React, { useEffect, useState } from "react";
import { PageLayout } from "./../components/library/Layouts/PageLayout";
import UserList from "./Users/UserList";

export default function PageUsers(props)
{

	return (
		<PageLayout>
			<UserList/>
		</PageLayout>
	);
}
