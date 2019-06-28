class Issue {
    constructor(project, issueType, reporter, organization, summary, priority, dueDate, component, affectedVersion, fixVersion, assignee, description, createDate) {
        this.id = null;
        this.project = project;
        this.issue_type = issueType;
        this.reporter = reporter;
        this.organization = organization;
        this.summary = summary;
        this.priority = priority;
        this.dueDate = dueDate;
        this.component = component;
        this.affectedVersion = affectedVersion;
        this.fixVersion = fixVersion;
        this.assignee = assignee;
        this.description = description;
        this.createDate = createDate;
        this.comments = [];
        this.status = "open";
        this.watchers = [];
    }
}