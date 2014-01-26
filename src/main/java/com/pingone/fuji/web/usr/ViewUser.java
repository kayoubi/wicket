package com.pingone.fuji.web.usr;

import com.pingone.fuji.web.dto.UserDto;
import com.pingone.fuji.web.svc.FujiSvc;
import org.apache.wicket.markup.html.WebPage;
import org.apache.wicket.markup.html.basic.Label;
import org.apache.wicket.markup.html.form.TextField;
import org.apache.wicket.markup.html.link.BookmarkablePageLink;
import org.apache.wicket.model.PropertyModel;
import org.apache.wicket.request.mapper.parameter.PageParameters;
import org.apache.wicket.spring.injection.annot.SpringBean;

/**
 * @author Khaled Ayoubi
 */
public class ViewUser extends WebPage {
    @SpringBean
    private FujiSvc fujiSvc;

    public ViewUser(PageParameters parameters) {
        super(parameters);
        String email = parameters.getValues("email").get(0).toOptionalString();
        UserDto user;
        if (fujiSvc.isEmailTakenByAUser(email)) {
            user = fujiSvc.getUser(email);
        } else {
            user = new UserDto();
        }

        add(new Label("title", "View User"));
        add(new TextField<String>("email", new PropertyModel<String>(user, "email")));
        add(new TextField<String>("firstName", new PropertyModel<String>(user, "firstName")));
        add(new TextField<String>("lastName", new PropertyModel<String>(user, "lastName")));
        add(new BookmarkablePageLink<AddUser>("addUser", AddUser.class));
    }
}
