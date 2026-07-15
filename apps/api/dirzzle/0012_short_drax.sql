CREATE TABLE "sys_role" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"name" varchar(30) NOT NULL,
	"code" varchar(100) NOT NULL,
	"sort" varchar(4) DEFAULT '0' NOT NULL,
	"status" char(1) DEFAULT '0' NOT NULL,
	"data_scope" char(1) DEFAULT '1' NOT NULL,
	"remark" varchar(500),
	"create_by" varchar(64) DEFAULT '' NOT NULL,
	"create_time" timestamp with time zone DEFAULT now() NOT NULL,
	"update_by" varchar(64) DEFAULT '' NOT NULL,
	"update_time" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sys_user_role" (
	"user_id" varchar(32) NOT NULL,
	"role_id" varchar(32) NOT NULL,
	CONSTRAINT "sys_user_role_user_id_role_id_pk" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "sys_role_menu" (
	"role_id" varchar(32) NOT NULL,
	"menu_id" varchar(32) NOT NULL,
	CONSTRAINT "sys_role_menu_role_id_menu_id_pk" PRIMARY KEY("role_id","menu_id")
);
